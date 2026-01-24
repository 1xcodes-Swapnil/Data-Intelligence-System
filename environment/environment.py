from data_sources.silver_sources import get_silver_data_sources
from utils.logger import AILogger


class SilverMarketEnvironment:
    def __init__(self):
        """
        Stage-2 real-time silver market environment
        """
        self.time_step = 0
        self.logger = AILogger(name="Environment")

        self.sources = self._load_sources()

    def _load_sources(self):
        sources = get_silver_data_sources()
        if not sources:
            self.logger.logger.warning("No live sources loaded")
        return sources

    # -------------------------------
    # Interface
    # -------------------------------
    def get_all_sources(self):
        return self.sources

    # -------------------------------
    # Dynamics
    # -------------------------------
    def step(self):
        """
        Refresh environment with live data
        """
        self.time_step += 1
        self.sources = self._load_sources()

        self.logger.logger.info(
            f"ENV UPDATE | Timestep: {self.time_step} | Sources: {list(self.sources.keys())}"
        )

    # -------------------------------
    # Reward Logic
    # -------------------------------
    def calculate_reward(self, source_name: str) -> float:
        source = self.sources[source_name]
        avg_value = self._market_average_value()

        quality = (
            source["freshness"]
            * source["reliability"]
            * (1 / (1 + abs(source["value"] - avg_value)))
        )

        reward = quality - source["cost"]

        self.logger.logger.info(
            f"REWARD | Source: {source_name} | Quality: {quality:.4f} | Cost: {source['cost']}"
        )

        return reward

    def _market_average_value(self):
        return sum(s["value"] for s in self.sources.values()) / len(self.sources)
