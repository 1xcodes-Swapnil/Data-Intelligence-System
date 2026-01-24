from abc import ABC, abstractmethod

class Predictor(ABC):
    """
    Abstract base class for all silver price predictors.
    Enforces a standard interface for AI models.
    """

    @abstractmethod
    def add_price(self, price: float):
        """
        Add a new observed silver price into the model.
        """
        pass

    @abstractmethod
    def predict_next(self) -> float:
        """
        Predict the next silver price.
        Returns None if prediction is not possible yet.
        """
        pass

    @abstractmethod
    def trend(self) -> str:
        """
        Returns:
            'up', 'down', or 'stable' based on recent price movement.
        """
        pass

    @abstractmethod
    def confidence(self) -> float:
        """
        Returns a confidence score for the prediction (0 to 1).
        Higher = more reliable.
        """
        pass
