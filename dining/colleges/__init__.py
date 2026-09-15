from .base import CollegeAdapter
from .umd import UMDAdapter

ADAPTERS: dict[str, type[CollegeAdapter]] = {
    UMDAdapter.slug: UMDAdapter,
}


def get_adapter(slug: str) -> CollegeAdapter:
    try:
        return ADAPTERS[slug]()
    except KeyError:
        known = ", ".join(sorted(ADAPTERS)) or "none"
        raise SystemExit(f"Unknown college {slug!r}. Available: {known}")
