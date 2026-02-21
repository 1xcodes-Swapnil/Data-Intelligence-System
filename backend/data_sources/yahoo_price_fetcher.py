import yfinance as yf
from datetime import datetime

# Priority order: Futures → Spot
SILVER_TICKERS = [
    ("SI=F", "Silver Futures (COMEX)"),
    ("XAGUSD=X", "Silver Spot (USD)")
]


def get_live_silver_price():
    """
    Fetches live silver price using Yahoo Finance.
    Priority:
    1. Silver Futures (SI=F)
    2. Spot Silver (XAGUSD=X)

    Returns:
        (price: float, source: str) or (None, None)
    """

    for symbol, label in SILVER_TICKERS:
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1d")

            if not data.empty:
                latest_price = data["Close"].iloc[-1]
                if latest_price > 0:
                    return round(float(latest_price), 4), label

        except Exception as e:
            print(
                f"[Yahoo Fetch Error] {symbol} ({label}) @ {datetime.now()} → {e}"
            )

    return None, None
