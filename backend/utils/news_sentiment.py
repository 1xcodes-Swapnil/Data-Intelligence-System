import os
import requests
from dotenv import load_dotenv

load_dotenv()

# Optional dependency (demo-safe)
try:
    from textblob import TextBlob
except ImportError:
    TextBlob = None

GNEWS_KEY = os.getenv("GNEWS_API_KEY")


class NewsSentimentAnalyzer:
    def __init__(self):
        self.endpoint = "https://gnews.io/api/v4/search"

    def get_sentiment(self, query="silver market") -> float:
        """
        Returns sentiment score in range [0.0, 1.0]
        """

        # Safe fallback if API or TextBlob missing
        if not GNEWS_KEY or TextBlob is None:
            return 0.5

        params = {
            "q": query,
            "lang": "en",
            "max": 5,
            "apikey": GNEWS_KEY,
        }

        try:
            r = requests.get(self.endpoint, params=params, timeout=10)
            articles = r.json().get("articles", [])

            if not articles:
                return 0.5

            polarity_scores = []

            for article in articles:
                text = f"{article.get('title','')} {article.get('description','')}"
                polarity_scores.append(
                    TextBlob(text).sentiment.polarity
                )

            avg = sum(polarity_scores) / len(polarity_scores)

            # normalize [-1,1] → [0,1]
            return round((avg + 1) / 2, 4)

        except Exception as e:
            print("GNews sentiment error:", e)
            return 0.5


# -------------------------------------------------
# 🔥 THIS IS WHAT THE AGENT CALLS
# -------------------------------------------------
def fetch_silver_news_sentiment() -> float:
    """
    Agent-facing sentiment function.
    MUST return a float.
    """

    analyzer = NewsSentimentAnalyzer()
    return analyzer.get_sentiment("silver market")
