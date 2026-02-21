# agent/decision_policy.py

def calculate_score(
    freshness: float,
    reliability: float,
    cost: float,
    remaining_budget: float
) -> float:
    """
    Stage-2 decision policy for autonomous data selection.

    Inputs:
    - freshness, reliability, cost ∈ [0, 1]
    - remaining_budget ∈ [0, total_budget]

    Output:
    - Base utility score (learning & confidence handled by agent)
    """

    # 🔹 No budget left → no action
    if remaining_budget <= 0:
        return 0.0

    # 🔹 Core utility (interpretable & explainable)
    base_score = (
        (0.45 * freshness) +        # how recent the data is
        (0.45 * reliability) -      # how trustworthy the source is
        (0.25 * cost)               # how expensive it is
    )

    # 🔹 Budget sensitivity (graceful decay, not hard stop)
    # Agent becomes conservative as budget drops
    budget_factor = min(1.0, remaining_budget)

    score = base_score * budget_factor

    # 🔹 Never return negative (agent handles penalties separately)
    return max(score, 0.0)
