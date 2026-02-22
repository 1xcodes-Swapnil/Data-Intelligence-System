# intelligence/sentiment.py

import requests
import os
from textblob import TextBlob


# -------------------------------
# Config
# -------------------------------
GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")


# -------------------------------
# Sentiment Analyzer
# -------------------------------
class SentimentAnalyzer:
    """
    Fetches silver-related news and computes sentiment score.
    Provides BOTH raw and normalized interfaces.
    """

    def __init__(self):
        self.endpoint = "https://gnews.io/api/v4/search"

    # --------------------------------------------------
    # News Fetching
    # --------------------------------------------------
    def fetch_news(self, query="silver price"):
        try:
            params = {
                "q": query,
                "lang": "en",
                "max": 10,
                "apikey": GNEWS_API_KEY,
            }

            response = requests.get(self.endpoint, params=params, timeout=10)
            data = response.json()

            articles = data.get("articles", [])
            return [
                f"{a.get('title', '')} {a.get('description', '')}"
                for a in articles
            ]

        except Exception as e:
            print("GNews error:", e)
            return []

    # --------------------------------------------------
    # Core Analysis
    # --------------------------------------------------
    def analyze(self, content=None):
        """
        Returns:
            sentiment ∈ [-1, 1]
            confidence ∈ [0, 1]
        """

        texts = []

        if content:
            texts = [content]
        else:
            texts = self.fetch_news()

        if not texts:
            return 0.0, 0.0

        polarities = []
        for text in texts:
            blob = TextBlob(text)
            polarities.append(blob.sentiment.polarity)

        avg_sentiment = sum(polarities) / len(polarities)
        confidence = min(1.0, len(texts) / 10)

        return round(avg_sentiment, 4), round(confidence, 4)

    def analyze_from_news(self, query="silver price"):
        """
        Returns normalized sentiment ∈ [0,1]
        SAFE for agent math.
        """

        sentiment, confidence = self.analyze(query)

        # Convert [-1,1] → [0,1]
        normalized = (sentiment + 1) / 2

        # Confidence-weighted signal
        weighted = normalized * confidence + 0.5 * (1 - confidence)

        return round(weighted, 4)


# --------------------------------------------------
# Legacy Helper (kept for backward compatibility)
# --------------------------------------------------
def fetch_silver_news_sentiment():
    analyzer = SentimentAnalyzer()
    return analyzer.analyze_from_news()
