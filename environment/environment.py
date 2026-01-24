# environment/environment.py

class Environment:
    def __init__(self):
        """
        Stores the current state of all data sources.
        """
        self.sources = {}

    def add_source(
        self,
        name: str,
        freshness: float,
        reliability: float,
        cost: float
    ) -> None:
        """
        Adds or updates a data source in the environment.
        All values must be normalized between 0 and 1.
        """

        self.sources[name] = {
            "freshness": freshness,
            "reliability": reliability,
            "cost": cost
        }

    def get_source_state(self, name: str):
        """
        Returns the state of a data source.
        """

        return self.sources.get(name, None)

    def get_all_sources(self):
        """
        Returns all available data sources.
        """

        return self.sources
