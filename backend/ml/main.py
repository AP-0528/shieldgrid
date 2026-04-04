import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

from models import XGBoostRiskModel, IsolationForestFraudModel
from oracle import TriggerOracle

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("shieldgrid.api")

# Initialize models
risk_model = XGBoostRiskModel()
fraud_model = IsolationForestFraudModel()

# The Transactional API will be on port 3000
oracle = TriggerOracle(api_url="http://localhost:3000")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the oracle in the background on API startup
    task = asyncio.create_task(oracle.run())
    yield
    # Shutdown
    oracle.stop()
    task.cancel()

app = FastAPI(title="ShieldGrid ML & Oracle Service", lifespan=lifespan)

class RiskRequest(BaseModel):
    zone_density: float
    historical_rain_mm: float
    average_traffic_velocity: float

class PresenceRequest(BaseModel):
    worker_id: str
    ping_history: List[Dict[str, Any]] # e.g. [{"lat": 12.9, "lon": 77.5, "time": "..."}]

@app.get("/")
def health_check():
    return {"status": "ML API is running", "oracle_active": oracle.is_running}

@app.post("/evaluate-risk")
def evaluate_risk(req: RiskRequest):
    """
    Returns the dynamic pricing multiplier for a given policy request using the XGBoost Model.
    """
    features = req.model_dump()
    multiplier = risk_model.predict_risk_multiplier(features)
    return {
        "base_premium": 15.0, # INR
        "risk_multiplier": round(multiplier, 2),
        "final_premium": round(15.0 * multiplier, 2)
    }

@app.post("/verify-presence")
def verify_presence(req: PresenceRequest):
    """
    Evaluates spatial-temporal worker pings to confirm they were inside the
    trigger geofence during a disruption event, whilst dodging GPS spoofing checks.
    """
    is_valid = fraud_model.evaluate_presence(req.ping_history)
    if not is_valid:
        raise HTTPException(status_code=403, detail="Fraud anomaly detected: Impossible traversal speed.")
    
    return {
        "status": "VERIFIED",
        "worker_id": req.worker_id,
        "message": "Presence and traversal integrity confirmed."
    }
