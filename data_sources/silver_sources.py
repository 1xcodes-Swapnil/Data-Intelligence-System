# data_sources/silver_sources.py

def get_silver_data_sources():
    """
    Returns simulated silver-related data sources
    with normalized freshness, reliability, and cost.
    """

    return {
        "spot_price_api": {
            "freshness": 0.9,
            "reliability": 0.95,
            "cost": 0.6
        },
        "commodity_index": {
            "freshness": 0.6,
            "reliability": 0.85,
            "cost": 0.3
        },
        "market_news": {
            "freshness": 0.4,
            "reliability": 0.7,
            "cost": 0.2
        }
    }
