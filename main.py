from agent.agent import DataCollectionAgent
from environment.environment import SilverMarketEnvironment
from models.silver_predictor_arima import SilverPricePredictorARIMA
from utils.logger import AILogger


def main():
    logger = AILogger(name="BackendRunner")
    logger.logger.info("===== BACKEND EXECUTION STARTED =====")

    # 1️⃣ Create dynamic silver market environment
    env = SilverMarketEnvironment()

    logger.log_environment(
        timestep=env.time_step,
        info=f"Initialized environment with {len(env.get_all_sources())} sources"
    )

    # 2️⃣ Create agent
    agent = DataCollectionAgent(total_budget=5.0, epsilon=0.2)

    # 3️⃣ Agent selects best source
    selected_source, decision_score = agent.select_best_source(env)

    if selected_source is None:
        logger.log_error("No source selected. Exiting backend.")
        return

    # 4️⃣ Deduct cost from budget
    source_state = env.get_all_sources()[selected_source]
    agent.deduct_cost(source_state["cost"])

    # 5️⃣ Run prediction model
    predictor = SilverPricePredictorARIMA()
    # 🔹 Warm-up ARIMA with historical-like prices (demo-safe)
    historical_prices = [
    23.5, 23.6, 23.55, 23.7, 23.8,
    23.75, 23.9, 24.0, 23.95, 24.1
    ]

    for price in historical_prices:
        predictor.add_price(price)

    # 🔹 Feed real-time price from environment
    current_price = env.get_all_sources()[selected_source]["value"]

    predictor.add_price(current_price)

    prediction_result = predictor.predict_next()

    predicted_price = prediction_result["predicted_price"]
    trend = prediction_result["trend"]
    confidence = prediction_result["confidence"]

    logger.log_prediction(predicted_price, trend, confidence)

    # 6️⃣ Calculate reward using environment logic
    reward = env.calculate_reward(selected_source)

    # 7️⃣ Update learning
    agent.update_learning(selected_source, reward)

    # 8️⃣ Advance environment dynamics
    env.step()

    logger.logger.info("===== BACKEND EXECUTION FINISHED =====")


if __name__ == "__main__":
    main()
