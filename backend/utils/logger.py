import logging
from datetime import datetime
import os

class AILogger:
    """
    Central logger for the Autonomous AI Agent.
    Provides explainability and traceability.
    """

    def __init__(self, name="AI-Agent", log_dir="logs"):
        self.name = name
        self.log_dir = log_dir
        os.makedirs(log_dir, exist_ok=True)

        log_file = os.path.join(log_dir, f"{name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")

        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)

        # File handler
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.INFO)

        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)

        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )

        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)

        self.logger.info("=== AI Logging System Initialized ===")

    # -------- General Logs -------- #

    def log_decision(self, source_name, score, budget_remaining):
        self.logger.info(
            f"DECISION | Selected Source: {source_name} | Score: {score:.4f} | Budget Remaining: {budget_remaining:.2f}"
        )

    def log_reward(self, source_name, reward):
        self.logger.info(
            f"REWARD | Source: {source_name} | Reward: {reward:.4f}"
        )

    def log_budget(self, old_budget, new_budget):
        self.logger.info(
            f"BUDGET | Old: {old_budget:.2f} -> New: {new_budget:.2f}"
        )

    def log_learning(self, source_name, old_value, new_value):
        self.logger.info(
            f"LEARNING | Source: {source_name} | Old Value: {old_value:.4f} -> New Value: {new_value:.4f}"
        )

    def log_environment(self, timestep, info):
        self.logger.info(
            f"ENV | Timestep: {timestep} | Info: {info}"
        )

    def log_prediction(self, predicted_price, trend, confidence):
        self.logger.info(
            f"PREDICTION | Next Price: {predicted_price} | Trend: {trend} | Confidence: {confidence}"
        )

    def log_error(self, error_msg):
        self.logger.error(f"ERROR | {error_msg}")
