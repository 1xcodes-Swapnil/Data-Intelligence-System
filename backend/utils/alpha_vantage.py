import requests
from config import ALPHA_VANTAGE_API_KEY

def fetch_silver_price():
    url = (
        "https://www.alphavantage.co/query"
        "?function=GLOBAL_QUOTE"
        "&symbol=XAGUSD"
        f"&apikey={ALPHA_VANTAGE_API_KEY}"
    )

    response = requests.get(url).json()

    try:
        price = float(response["Global Quote"]["05. price"])
        return price
    except Exception:
        return None
