"""Normalize allergen vocabulary across colleges and across sources.

A single college can describe the same allergen two ways: the label page says
"Soybeans", the menu-row icon says "Contains soy". Different colleges differ
again. Everything is mapped onto one canonical set so a filter like
"no peanuts" means the same thing everywhere.
"""

CANONICAL = (
    "dairy", "eggs", "fish", "shellfish", "tree_nuts", "peanuts",
    "gluten", "soy", "sesame", "coconut", "alcohol", "pork", "pea_protein",
)

#: Source vocabulary (lowercased, "contains " already stripped) -> canonical name.
SYNONYMS = {
    "dairy": "dairy", "milk": "dairy",
    "egg": "eggs", "eggs": "eggs",
    "fish": "fish",
    "shellfish": "shellfish", "crustacean shellfish": "shellfish",
    "nuts": "tree_nuts", "tree nuts": "tree_nuts",
    "peanut": "peanuts", "peanuts": "peanuts",
    "gluten": "gluten", "wheat": "gluten",
    "soy": "soy", "soybeans": "soy", "soybean": "soy",
    "sesame": "sesame",
    "coconut": "coconut",
    "alcohol": "alcohol",
    "pork": "pork",
    "pea protein": "pea_protein",
}

#: Legend icons that describe a diet, not an allergen.
DIET_TAGS = {"vegan", "vegetarian", "halal friendly", "halalfriendly",
             "locally grown", "local"}


def normalize(term: str) -> str | None:
    """Map one raw allergen term to its canonical name, or None if unrecognized."""
    cleaned = term.strip().lower()
    for prefix in ("contains ", "contains:"):
        if cleaned.startswith(prefix):
            cleaned = cleaned[len(prefix):].strip()
    if not cleaned or cleaned in DIET_TAGS:
        return None
    return SYNONYMS.get(cleaned)


def normalize_all(terms) -> tuple[list[str], list[str]]:
    """Return (canonical allergens, terms we did not recognize)."""
    found: set[str] = set()
    unknown: list[str] = []
    for term in terms:
        canonical = normalize(term)
        if canonical is not None:
            found.add(canonical)
        elif term.strip().lower() not in DIET_TAGS and term.strip():
            unknown.append(term)
    return sorted(found), unknown


def diets(tags) -> list[str]:
    """Pull diet markers (vegan, vegetarian, halal) out of legend icons."""
    out = set()
    for tag in tags:
        cleaned = tag.strip().lower()
        if cleaned in DIET_TAGS:
            out.add("halal" if cleaned.startswith("halal") else cleaned.replace(" ", "_"))
    return sorted(out)
