import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

from models import XGBoostRiskModel, IsolationForestFraudModel
from oracle import TriggerOracle, get_trigger_catalog

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("shieldgrid.api")

# Initialize models
risk_model = XGBoostRiskModel()
fraud_model = IsolationForestFraudModel()

# The Transactional API will be on port 3000
oracle = TriggerOracle(api_url="http://localhost:3000")

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(oracle.run())
    yield
    oracle.stop()
    task.cancel()

app = FastAPI(title="ShieldGrid ML & Oracle Service", lifespan=lifespan)

class RiskRequest(BaseModel):
    zone_density: float
    historical_rain_mm: float
    average_traffic_velocity: float

class ZoneRiskRequest(BaseModel):
    zone: str
    platform: str = "Zomato"

class PresenceRequest(BaseModel):
    worker_id: str
    ping_history: List[Dict[str, Any]]

# Zone profiles — simulates hyperlocal historical data
ZONE_PROFILES = {
    "Koramangala, BLR": {"zone_density": 0.85, "historical_rain_mm": 38.0, "average_traffic_velocity": 11.0, "zone_safety_discount": 0},
    "Whitefield, BLR":  {"zone_density": 0.60, "historical_rain_mm": 22.0, "average_traffic_velocity": 18.0, "zone_safety_discount": 2},
    "Indiranagar, BLR": {"zone_density": 0.90, "historical_rain_mm": 42.0, "average_traffic_velocity": 9.0,  "zone_safety_discount": 0},
    "HSR Layout, BLR":  {"zone_density": 0.70, "historical_rain_mm": 28.0, "average_traffic_velocity": 15.0, "zone_safety_discount": 1},
}

@app.get("/")
def health_check():
    return {
        "status": "ML API is running",
        "oracle_active": oracle.is_running,
        "triggers_monitored": 5
    }

@app.get("/trigger-types")
def get_trigger_types():
    """Returns all 5 parametric trigger types covered by ShieldGrid."""
    return {"triggers": get_trigger_catalog(), "total": 5}

@app.post("/evaluate-risk")
def evaluate_risk(req: RiskRequest):
    """Dynamic pricing via XGBoost model."""
    features = req.model_dump()
    multiplier = risk_model.predict_risk_multiplier(features)
    return {
        "base_premium": 15.0,
        "risk_multiplier": round(multiplier, 2),
        "final_premium": round(15.0 * multiplier, 2)
    }

@app.post("/evaluate-zone-risk")
def evaluate_zone_risk(req: ZoneRiskRequest):
    """
    Zone-aware dynamic premium. Historically safer zones get a discount.
    Example: Whitefield gets ₹2 discount vs Koramangala due to lower flood history.
    """
    profile = ZONE_PROFILES.get(req.zone, ZONE_PROFILES["Koramangala, BLR"])
    multiplier = risk_model.predict_risk_multiplier({
        "zone_density": profile["zone_density"],
        "historical_rain_mm": profile["historical_rain_mm"],
        "average_traffic_velocity": profile["average_traffic_velocity"],
    })

    base = 15.0
    discount = profile["zone_safety_discount"]
    final = round(max(10.0, (base * multiplier) - discount), 2)

    return {
        "zone": req.zone,
        "platform": req.platform,
        "base_premium": base,
        "risk_multiplier": round(multiplier, 2),
        "zone_safety_discount": discount,
        "final_premium": final,
        "breakdown": {
            "zone_density": profile["zone_density"],
            "historical_rain_mm": profile["historical_rain_mm"],
            "avg_traffic_velocity": profile["average_traffic_velocity"],
        }
    }

@app.post("/verify-presence")
def verify_presence(req: PresenceRequest):
    """
    Isolation Forest fraud detection — evaluates spatial-temporal GPS pings
    to confirm presence inside the disruption geofence.
    """
    is_valid = fraud_model.evaluate_presence(req.ping_history)
    if not is_valid:
        raise HTTPException(status_code=403, detail="Fraud anomaly detected: Impossible traversal speed.")

    return {
        "status": "VERIFIED",
        "worker_id": req.worker_id,
        "message": "Presence and traversal integrity confirmed."
    }
