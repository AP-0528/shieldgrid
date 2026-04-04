import asyncio
import random
import requests
import logging
from datetime import datetime

logger = logging.getLogger("shieldgrid.oracle")

class TriggerOracle:
    """
    Simulates polling the OpenWeatherMap and Mapbox APIs.
    If a threshold is crossed, it emits a trigger event to the Transactional API.
    """
    def __init__(self, api_url: str):
        self.api_url = api_url
        self.is_running = False
        
    async def poll_environment_data(self):
        """Mock the fetching of weather/traffic data"""
        # Simulate an API call delay
        await asyncio.sleep(1)
        
        # 10% chance of a mock weather event for prototype demonstration
        if random.random() < 0.10:
            return {
                "zone": "Koramangala, BLR",
                "event_type": "RAINFALL",
                "value": random.uniform(55.0, 80.0), # mm/hr
                "threshold": 50.0,
                "timestamp": datetime.utcnow().isoformat()
            }
        return None

    async def run(self):
        self.is_running = True
        logger.info("Trigger Oracle started. Polling every 10 seconds.")
        
        while self.is_running:
            try:
                event = await self.poll_environment_data()
                if event:
                    logger.warning(f"🚨 DISRUPTION DETECTED: {event['event_type']} in {event['zone']} ({event['value']:.1f} mm/hr)")
                    self._fire_trigger(event)
                else:
                    logger.info("Environment stable. No triggers.")
            except Exception as e:
                logger.error(f"Oracle polling error: {e}")
                
            await asyncio.sleep(10) # Poll every 10 seconds for demo purposes
            
    def _fire_trigger(self, event_payload):
        """Send the trigger event to the NestJS cluster for evaluation"""
        logger.info(f"Firing trigger to Transaction API: {self.api_url}/payouts/trigger")
        try:
            # We wrap in try-except because the Nest API might not be reachable
            res = requests.post(f"{self.api_url}/payouts/trigger", json=event_payload, timeout=3)
            if res.status_code == 201:
                logger.info("Transaction API accepted the trigger event.")
            else:
                logger.error(f"Transaction API rejected trigger: {res.status_code}")
        except requests.RequestException as e:
            logger.error(f"Failed to reach Transaction API: {e}. Is NestJS running?")

    def stop(self):
        self.is_running = False
