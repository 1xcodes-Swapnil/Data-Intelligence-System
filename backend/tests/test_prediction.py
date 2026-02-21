import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models.silver_predictor_arima import SilverPricePredictorARIMA
from data_sources.sample_prices import get_sample_silver_prices

def main():
    predictor = SilverPricePredictorARIMA(order=(2,1,2), min_data_points=10)

    prices = get_sample_silver_prices()

    for price in prices:
        predictor.add_price(price)

    print("\nSilver Price History:", prices)
    print("Predicted Next Price:", predictor.predict_next())
    print("Trend:", predictor.trend())
    print("Confidence:", predictor.confidence())

if __name__ == "__main__":
    main()
