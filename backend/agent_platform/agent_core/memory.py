"""
Memory store used by agents for persistence within a session.

This default implementation is process-local (in-memory, lost on restart).
Swap it for a real backend (Postgres, Redis, a vector store like pgvector /
Chroma) by implementing the same 4 methods and passing your store into
Agent(memory=...). BrandMemoryAgent in particular should move to a real
store once brand knowledge needs to survive restarts / scale past one process.
"""
from typing import Any, Dict, List, Optional


class InMemoryStore:
    def __init__(self):
        self._data: Dict[str, Any] = {}
        self._categories: Dict[str, str] = {}

    def set(self, key: str, value: Any, category: str = "general") -> None:
        self._data[key] = value
        self._categories[key] = category

    def get(self, key: str) -> Optional[Any]:
        return self._data.get(key)

    def delete(self, key: str) -> None:
        self._data.pop(key, None)
        self._categories.pop(key, None)

    def search(self, query: str) -> List[Dict[str, Any]]:
        """Naive substring search. Replace with embedding search for real use."""
        query_l = query.lower()
        hits = []
        for k, v in self._data.items():
            if query_l in f"{k} {v}".lower():
                hits.append({"key": k, "value": v, "category": self._categories.get(k, "general")})
        return hits

    def all(self, category: Optional[str] = None) -> Dict[str, Any]:
        if category is None:
            return dict(self._data)
        return {k: v for k, v in self._data.items() if self._categories.get(k) == category}
