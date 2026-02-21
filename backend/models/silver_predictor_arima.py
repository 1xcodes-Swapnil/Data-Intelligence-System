import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from models.predictor_interface import Predictor


class SilverPricePredictorARIMA(Predictor):
    """
    ARIMA-based time series predictor for silver prices.
    Fully implements Predictor interface.
    """

    def __init__(self, order=(2, 1, 2), min_data_points=10):
        self.order = order
        self.min_data_points = min_data_points
        self.prices = []
        self._last_prediction = None
        self._last_confidence = None

    # -------------------------------
    # Data ingestion
    # -------------------------------
    def add_price(self, price: float):
        self.prices.append(price)

    def is_ready(self) -> bool:
        return len(self.prices) >= self.min_data_points

    # -------------------------------
    # Core prediction
    # -------------------------------
    def predict_next(self):
        """
        Predicts the next silver price.
        Returns structured output.
        """

        if not self.is_ready():
            self._last_prediction = None
            self._last_confidence = 0.0
            return {
                "predicted_price": None,
                "trend": "unknown",
                "confidence": 0.0
            }

        try:
            model = ARIMA(self.prices, order=self.order)
            fitted = model.fit()
            forecast = fitted.forecast(steps=1)

            predicted_price = float(round(forecast[0], 4))
            self._last_prediction = predicted_price

            # --- confidence ---
            residuals = fitted.resid
            mse = np.mean(residuals ** 2)
            self._last_confidence = round(1 / (1 + mse), 4)

            return {
                "predicted_price": predicted_price,
                "trend": self.trend(),
                "confidence": self.confidence()
            }

        except Exception as e:
            print("ARIMA prediction error:", e)
            self._last_prediction = None
            self._last_confidence = 0.0
            return {
                "predicted_price": None,
                "trend": "error",
                "confidence": 0.0
            }

    # -------------------------------
    # REQUIRED abstract methods
    # -------------------------------
    def trend(self):
        """
        Returns trend direction.
        """
        if len(self.prices) < 2 or self._last_prediction is None:
            return "unknown"

        last_price = self.prices[-1]

        if self._last_prediction > last_price:
            return "up"
        elif self._last_prediction < last_price:
            return "down"
        return "stable"

    def confidence(self):
        """
        Returns confidence of last prediction.
        """
        return self._last_confidence if self._last_confidence is not None else 0.0
