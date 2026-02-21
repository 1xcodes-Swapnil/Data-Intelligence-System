import os
import time
import requests
import yfinance as yf
from dotenv import load_dotenv

load_dotenv()

ALPHA_KEY = os.getenv("ALPHAVANTAGE_API_KEY")


def normalize(value, min_val, max_val):
    if max_val - min_val == 0:
        return 0.5
    return max(0.0, min(1.0, (value - min_val) / (max_val - min_val)))


def get_silver_data_sources():
    """
    Live silver data sources for autonomous agent evaluation
    """

    sources = {}
    now = time.time()

    # -------------------------------
    # 1️⃣ Yahoo Finance — Spot Silver
    # -------------------------------
    try:
        ticker = yf.Ticker("SI=F")
        price = ticker.history(period="1d")["Close"].iloc[-1]

        sources["spot_silver"] = {
            "freshness": 0.95,
            "reliability": 0.95,
            "cost": 0.3,
            "value": float(price),
            "provider": "YahooFinance",
            "last_updated": now
        }
    except Exception:
        pass

    # ---------------------------------
    # 2️⃣ Yahoo Finance — Silver Futures
    # ---------------------------------
    try:
        futures = yf.Ticker("SIL")
        volume = futures.history(period="1d")["Volume"].iloc[-1]

        sources["silver_futures"] = {
            "freshness": 0.9,
            "reliability": 0.9,
            "cost": 0.35,
            "value": normalize(volume, 0, 1e8),
            "provider": "YahooFinance",
            "last_updated": now
        }
    except Exception:
        pass

    # -------------------------------
    # 3️⃣ Alpha Vantage — Silver Price
    # -------------------------------
    try:
        url = (
            "https://www.alphavantage.co/query?"
            "function=COMMODITY_EXCHANGE_RATE"
            "&from_currency=XAG"
            "&to_currency=USD"
            f"&apikey={ALPHA_KEY}"
        )
        data = requests.get(url, timeout=10).json()
        price = float(data["Realtime Commodity Exchange Rate"]["5. Exchange Rate"])

        sources["alphavantage_silver"] = {
            "freshness": 0.85,
            "reliability": 0.9,
            "cost": 0.4,
            "value": normalize(price, 10, 40),
            "provider": "AlphaVantage",
            "last_updated": now
        }
    except Exception:
        pass

    return sources
