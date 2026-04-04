import asyncio
import random
import requests
import logging
from datetime import datetime

logger = logging.getLogger("shieldgrid.oracle")

# --- 5 Disruption Trigger Definitions ---
# Each simulates polling a different real-world public API
TRIGGER_TYPES = [
    {
        "event_type": "RAINFALL",
        "source": "OpenWeatherMap API",
        "unit": "mm/hr",
        "threshold": 50.0,
        "description": "Severe rainfall exceeding 50mm/hour",
        "value_range": (55.0, 90.0),
        "payout_amount": 800,
        "weight": 0.35,  # 35% probability when a trigger fires
    },
    {
        "event_type": "HEATWAVE",
        "source": "IMD Temperature API",
        "unit": "°C",
        "threshold": 45.0,
        "description": "Extreme heat above 45°C rendering outdoor work dangerous",
        "value_range": (45.5, 48.0),
        "payout_amount": 600,
        "weight": 0.20,
    },
    {
        "event_type": "TRAFFIC_JAM",
        "source": "Mapbox Traffic API",
        "unit": "km/h avg velocity",
        "threshold": 5.0,  # below 5 km/h means gridlock
        "description": "Citywide gridlock — average road velocity below 5 km/h",
        "value_range": (1.0, 4.5),
        "payout_amount": 500,
        "weight": 0.25,
    },
    {
        "event_type": "AQI_HAZARD",
        "source": "CPCB Air Quality Index API",
        "unit": "AQI",
        "threshold": 300.0,
        "description": "Severe air quality hazard above AQI 300 (Hazardous)",
        "value_range": (301.0, 420.0),
        "payout_amount": 400,
        "weight": 0.10,
    },
    {
        "event_type": "CIVIC_CURFEW",
        "source": "Govt Alert API (Mock)",
        "unit": "curfew_active",
        "threshold": 1.0,
        "description": "Section 144 or civic curfew declared in zone",
        "value_range": (1.0, 1.0),
        "payout_amount": 1000,
        "weight": 0.10,
    },
]

def get_trigger_catalog():
    """Returns the full list of covered trigger types for the frontend."""
    return [
        {
            "event_type": t["event_type"],
            "source": t["source"],
            "unit": t["unit"],
            "threshold": t["threshold"],
            "description": t["description"],
            "payout_amount": t["payout_amount"],
        }
        for t in TRIGGER_TYPES
    ]


class TriggerOracle:
    """
    Polls 5 different disruption data sources (mocked).
    If any parametric threshold is crossed, it fires a trigger
    event to the Transactional API for immediate payout processing.
    """
    def __init__(self, api_url: str):
        self.api_url = api_url
        self.is_running = False

    async def poll_environment_data(self):
        """
        Simulates polling 5 external APIs simultaneously.
        Each has an independent probability of firing.
        In production, these would be real HTTP calls to:
        - OpenWeatherMap, IMD, Mapbox, CPCB, and Government Alert RSS feeds.
        """
        await asyncio.sleep(0.5)

        # ~12% chance any single poll detects a disruption
        if random.random() < 0.12:
            # Select a trigger type weighted by probability
            weights = [t["weight"] for t in TRIGGER_TYPES]
            trigger_def = random.choices(TRIGGER_TYPES, weights=weights, k=1)[0]

            value = random.uniform(*trigger_def["value_range"])

            return {
                "zone": "Koramangala, BLR",
                "event_type": trigger_def["event_type"],
                "value": round(value, 2),
                "threshold": trigger_def["threshold"],
                "source": trigger_def["source"],
                "payout_amount": trigger_def["payout_amount"],
                "description": trigger_def["description"],
                "timestamp": datetime.utcnow().isoformat(),
            }
        return None

    async def run(self):
        self.is_running = True
        logger.info("🛡️ Trigger Oracle started. Monitoring 5 disruption channels every 10s.")

        while self.is_running:
            try:
                event = await self.poll_environment_data()
                if event:
                    logger.warning(
                        f"🚨 DISRUPTION DETECTED: [{event['event_type']}] "
                        f"in {event['zone']} — {event['value']} {event.get('source', '')}"
                    )
                    self._fire_trigger(event)
                else:
                    logger.info("✅ All 5 channels stable. No parametric thresholds breached.")
            except Exception as e:
                logger.error(f"Oracle polling error: {e}")

            await asyncio.sleep(10)

    def _fire_trigger(self, event_payload):
        """Sends the trigger event to NestJS for validation and payout processing."""
        logger.info(f"Firing trigger → Transaction API: {self.api_url}/payouts/trigger")
        try:
            res = requests.post(
                f"{self.api_url}/payouts/trigger",
                json=event_payload,
                timeout=3
            )
            if res.status_code in (200, 201):
                logger.info(f"✅ Transaction API accepted trigger: {event_payload['event_type']}")
            else:
                logger.error(f"Transaction API rejected trigger: {res.status_code} — {res.text}")
        except requests.RequestException as e:
            logger.error(f"Failed to reach Transaction API: {e}")

    def stop(self):
        self.is_running = False
        logger.info("Trigger Oracle stopped.")
