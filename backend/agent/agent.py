import random
import math

from utils.logger import AILogger
from agent.decision_policy import calculate_score
from learning.bandit import MultiArmedBandit


class DataCollectionAgent:
    def __init__(self, total_budget: float, epsilon: float = 0.2):
        """
        Stage-2 Autonomous Data Collection Agent
        """
        self.total_budget = total_budget
        self.remaining_budget = total_budget
        self.epsilon = epsilon

        # 🔹 Learning memory
        self.bandit = MultiArmedBandit()

        # 🔹 Logger
        self.logger = AILogger(name="DataCollectionAgent")

        # 🔹 Decision counter (for confidence bonus)
        self.total_decisions = 0

    # ------------------------------------------------------------------
    # Evaluation
    # ------------------------------------------------------------------
    def evaluate_source(self, freshness, reliability, cost, source_name):
        """
        Rule-based + learned + confidence-aware evaluation
        """

        # 🔹 Soft budget penalty (NOT hard rejection)
        budget_penalty = 0.0
        if cost > self.remaining_budget:
            budget_penalty = 1.5 * (cost - self.remaining_budget)

        rule_score = calculate_score(
            freshness=freshness,
            reliability=reliability,
            cost=cost,
            remaining_budget=self.remaining_budget
        )

        learned_value = self.bandit.get_estimated_value(source_name)
        pulls = self.bandit.get_count(source_name)

        # 🔹 Confidence bonus (UCB-style)
        confidence_bonus = (
            math.sqrt(math.log(self.total_decisions + 1) / (pulls + 1))
            if self.total_decisions > 0 else 0.0
        )

        final_score = (
            rule_score
            + learned_value
            + 0.5 * confidence_bonus
            - budget_penalty
        )

        return final_score

    # ------------------------------------------------------------------
    # Explainable AI
    # ------------------------------------------------------------------
    def explain_decision(self, evaluations, selected_source):
        selected = evaluations[selected_source]

        explanation = [
            f"Source '{selected_source}' selected due to "
            f"high freshness ({selected['freshness']:.2f}), "
            f"reliability ({selected['reliability']:.2f}), "
            f"and acceptable cost ({selected['cost']:.2f})."
        ]

        if selected["learned"] > 0:
            explanation.append(
                f"Historical learning increased confidence "
                f"(learned value = {selected['learned']:.3f})."
            )

        for name, data in evaluations.items():
            if name == selected_source:
                continue

            reasons = []
            if data["freshness"] < selected["freshness"]:
                reasons.append("lower freshness")
            if data["reliability"] < selected["reliability"]:
                reasons.append("lower reliability")
            if data["cost"] > selected["cost"]:
                reasons.append("higher cost")

            if reasons:
                explanation.append(
                    f"Source '{name}' deprioritized due to " + ", ".join(reasons) + "."
                )

        return " ".join(explanation)

    # ------------------------------------------------------------------
    # Decision Making
    # ------------------------------------------------------------------
    def select_best_source(self, environment):
        if self.remaining_budget <= 0:
            self.logger.log_error("Budget exhausted. No source selected.")
            return None, 0.0

        self.total_decisions += 1
        sources = environment.get_all_sources()
        evaluations = {}

        # -------- Exploration --------
        if random.random() < self.epsilon:
            source_name = random.choice(list(sources.keys()))
            state = sources[source_name]

            score = self.evaluate_source(
                state["freshness"],
                state["reliability"],
                state["cost"],
                source_name
            )

            self.logger.log_decision(source_name, score, self.remaining_budget)
            self._decay_epsilon()
            return source_name, score

        # -------- Exploitation --------
        best_source, best_score = None, float("-inf")

        for name, state in sources.items():
            score = self.evaluate_source(
                state["freshness"],
                state["reliability"],
                state["cost"],
                name
            )

            evaluations[name] = {
                "freshness": state["freshness"],
                "reliability": state["reliability"],
                "cost": state["cost"],
                "learned": self.bandit.get_estimated_value(name),
                "score": score
            }

            if score > best_score:
                best_score = score
                best_source = name

        self.logger.log_decision(best_source, best_score, self.remaining_budget)

        explanation = self.explain_decision(evaluations, best_source)
        self.logger.logger.info(f"EXPLANATION | {explanation}")

        self._decay_epsilon()
        return best_source, best_score

    # ------------------------------------------------------------------
    # Learning
    # ------------------------------------------------------------------
    def update_learning(self, source_name, reward):
        if source_name is None:
            return

        old = self.bandit.get_estimated_value(source_name)
        self.bandit.update(source_name, reward)
        new = self.bandit.get_estimated_value(source_name)

        self.logger.log_reward(source_name, reward)
        self.logger.log_learning(source_name, old, new)

    # ------------------------------------------------------------------
    # Budget
    # ------------------------------------------------------------------
    def deduct_cost(self, cost):
        old = self.remaining_budget
        self.remaining_budget = max(0.0, self.remaining_budget - cost)
        self.logger.log_budget(old, self.remaining_budget)

    # ------------------------------------------------------------------
    # Exploration Control
    # ------------------------------------------------------------------
    def _decay_epsilon(self):
        self.epsilon = max(0.05, self.epsilon * 0.995)
