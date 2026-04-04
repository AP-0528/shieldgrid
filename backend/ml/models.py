import random
from typing import Dict, Any

class XGBoostRiskModel:
    """
    Mock XGBoost Regressor to simulate the ML layer for Dynamic Pricing.
    In production, this would load a trained .pkl or ONNX model.
    """
    def __init__(self):
        self._is_loaded = True

    def predict_risk_multiplier(self, features: Dict[str, Any]) -> float:
        """
        Features include:
        - historical_rain_mm
        - zone_density
        - average_traffic_velocity
        """
        # Simulated inference logic:
        # Higher rain + higher density = higher risk multiplier (max 2.0x)
        base = 1.0
        rain = features.get('historical_rain_mm', 0)
        
        if rain > 50:
            base += 0.5
        elif rain > 20:
            base += 0.2
            
        # Add some stochastic variance matching ML output
        variance = random.uniform(-0.05, 0.1)
        return min(2.0, max(1.0, base + variance))

class IsolationForestFraudModel:
    """
    Mock Isolation Forest to detect GPS spoofing and impossible traversal speeds.
    """
    def __init__(self):
        self._is_loaded = True

    def evaluate_presence(self, ping_history: list) -> bool:
        """
        Returns True if the worker is physically present with a normal
        movement pattern. Returns False if anomalous (e.g. spoofed GPS).
        """
        if not ping_history or len(ping_history) < 2:
            return True # Not enough data to flag as fraud
            
        # Simple heuristic masquerading as an IF:
        # Calculate speed between last two pings (dist/time)
        # If speed > 150km/h (impossible for a 2-wheeler), flag it.
        # Here we just mock the return based on a mock 'anomaly_score'
        
        anomaly_score = random.uniform(0, 1)
        # If score > 0.95 -> Outlier / Fraud
        return anomaly_score < 0.95
