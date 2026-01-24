# learning/bandit.py

class MultiArmedBandit:
    """
    Multi-Armed Bandit for tracking source performance.
    """

    def __init__(self):
        self.counts = {}   # number of pulls per source
        self.values = {}   # average reward per source

    # -------------------------------
    # Initialization
    # -------------------------------
    def _ensure_arm(self, arm_name: str):
        if arm_name not in self.counts:
            self.counts[arm_name] = 0
            self.values[arm_name] = 0.0

    # -------------------------------
    # Public API
    # -------------------------------
    def update(self, arm_name: str, reward: float):
        """
        Update running average reward.
        """
        self._ensure_arm(arm_name)

        self.counts[arm_name] += 1
        n = self.counts[arm_name]
        old_value = self.values[arm_name]

        self.values[arm_name] = old_value + (reward - old_value) / n

    def get_estimated_value(self, arm_name: str) -> float:
        """
        Return learned value for a source.
        """
        return self.values.get(arm_name, 0.0)

    def get_count(self, arm_name: str) -> int:
        """
        Return how many times a source was selected.
        """
        return self.counts.get(arm_name, 0)
