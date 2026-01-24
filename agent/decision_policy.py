# agent/decision_policy.py

def calculate_score(
    freshness: float,
    reliability: float,
    cost: float,
    remaining_budget: float
) -> float:
    """
    Calculates how valuable it is to collect data from a source.

    All inputs must be normalized between 0 and 1.
    Higher score = higher priority.
    """

    # No budget → no collection
    if remaining_budget <= 0:
        return 0.0

    # Core weighted scoring logic
    score = (
        (0.4 * freshness) +
        (0.4 * reliability) -
        (0.2 * cost)
    )

    # Budget awareness: become conservative as budget drops
    score = score * remaining_budget

    # Ensure score never goes negative
    return max(score, 0.0)
