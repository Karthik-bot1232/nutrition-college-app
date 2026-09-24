"""Interface every college adapter implements.

A college is onboarded by subclassing this and filling in the URL builders and
the two parsers. Everything else (caching, rate limiting, storage) is shared.
"""

import time
from datetime import date

import requests

from ..models import FoodItem, MenuEntry

USER_AGENT = "college-nutrition-app/0.1 (student project; contact via repo)"


class CollegeAdapter:
    slug: str
    name: str
    locations: dict[str, str]
    meals: tuple[str, ...]

    #: Usual serving window per meal, "HH:MM" 24h, keyed "weekday" / "weekend".
    #: The UI uses it to open on the meal being served now and to say whether a
    #: hall is open. It is the posted routine, not a feed: holidays and breaks
    #: differ, so the UI labels these as usual hours. Empty means "unknown",
    #: and the UI then simply does not show open/closed.
    hours: dict[str, dict[str, tuple[str, str]]] = {}

    #: Seconds to wait between requests, so we stay a polite guest on their server.
    request_delay = 0.5

    def __init__(self, session: requests.Session | None = None):
        self.session = session or requests.Session()
        self.session.headers["User-Agent"] = USER_AGENT
        self._last_request = 0.0

    def fetch(self, url: str) -> str:
        elapsed = time.monotonic() - self._last_request
        if elapsed < self.request_delay:
            time.sleep(self.request_delay - elapsed)

        response = self.session.get(url, timeout=30)
        self._last_request = time.monotonic()
        response.raise_for_status()
        return response.text

    def menu_url(self, location_id: str, day: date, meal: str) -> str:
        raise NotImplementedError

    def label_url(self, location_id: str, day: date, external_id: str) -> str:
        raise NotImplementedError

    def parse_menu(self, html: str, location_id: str, day: date, meal: str) -> list[MenuEntry]:
        raise NotImplementedError

    def parse_label(self, html: str, external_id: str, source_url: str) -> FoodItem:
        raise NotImplementedError
