# agent/agent.py

from agent.decision_policy import calculate_score


class DataCollectionAgent:
    def __init__(self, total_budget: float):
        """
        Initializes the agent with a total budget.
        Budget value should be between 0 and 1.
        """
        self.total_budget = total_budget
        self.remaining_budget = total_budget

    def evaluate_source(
        self,
        freshness: float,
        reliability: float,
        cost: float
    ) -> float:
        """
        Evaluates a data source and returns its priority score.
        """

        return calculate_score(
            freshness=freshness,
            reliability=reliability,
            cost=cost,
            remaining_budget=self.remaining_budget
        )

    def consume_budget(self, cost: float) -> None:
        """
        Deducts budget after collecting data.
        """

        self.remaining_budget -= cost
        self.remaining_budget = max(self.remaining_budget, 0.0)

    def select_best_source(self, environment):
        """
        Selects the best data source based on current environment state.
        Returns (source_name, score).
        """

        best_source = None
        best_score = 0.0

        for source_name, state in environment.get_all_sources().items():
            score = self.evaluate_source(
                freshness=state["freshness"],
                reliability=state["reliability"],
                cost=state["cost"]
            )

            if score > best_score:
                best_score = score
                best_source = source_name

        return best_source, best_score
