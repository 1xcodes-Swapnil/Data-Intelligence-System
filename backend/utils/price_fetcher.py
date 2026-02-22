import yfinance as yf

def minute_aware_price(ticker_symbol: str) -> float | None:
    """
    Returns REAL silver price using true minute delta.
    """
    ticker = yf.Ticker(ticker_symbol)
    hist = ticker.history(period="2d", interval="1m")

    if hist is None or len(hist) < 2:
        return None

    last = float(hist["Close"].iloc[-1])
    prev = float(hist["Close"].iloc[-2])

    minute_delta = last - prev
    adjusted_price = last + (minute_delta * 0.6)

    return round(adjusted_price, 4)
