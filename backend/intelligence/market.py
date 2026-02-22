import requests
import os
import time


# -------------------------------
# Config
# -------------------------------

ALPHA_KEY = os.getenv("ALPHA_VANTAGE_KEY")


# -------------------------------
# Market Impact Analyzer
# -------------------------------

class MarketImpactAnalyzer:
    """
    Uses Alpha Vantage time series to estimate
    short-term market momentum for silver
    """

    def __init__(self):
        self.base_url = "https://www.alphavantage.co/query"

    def fetch_intraday(self, symbol="XAGUSD"):
        try:
            params = {
                "function": "FX_INTRADAY",
                "from_symbol": "XAG",
                "to_symbol": "USD",
                "interval": "5min",
                "apikey": ALPHA_KEY
            }

            r = requests.get(self.base_url, params=params, timeout=10)
            data = r.json()

            series = data.get("Time Series FX (5min)", {})

            prices = []

            for t in sorted(series.keys(), reverse=True)[:5]:
                prices.append(float(series[t]["4. close"]))

            return prices

        except Exception as e:
            print("Alpha Vantage error:", e)
            return []

    def evaluate(self, symbol=None):
        """
        Returns market impact score ∈ [-1,1]
        """

        prices = self.fetch_intraday()

        if len(prices) < 2:
            return 0.0

        # simple momentum
        recent = prices[0]
        older = prices[-1]

        change_pct = (recent - older) / older

        # clamp
        if change_pct > 0.02:
            change_pct = 0.02
        if change_pct < -0.02:
            change_pct = -0.02

        # normalize approx to [-1,1]
        impact = change_pct / 0.02

        return round(impact, 4)
