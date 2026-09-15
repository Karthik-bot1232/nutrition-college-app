from dataclasses import dataclass, field, asdict
from datetime import date


NUTRIENT_FIELDS = (
    "calories",
    "total_fat_g",
    "saturated_fat_g",
    "trans_fat_g",
    "cholesterol_mg",
    "sodium_mg",
    "total_carbs_g",
    "dietary_fiber_g",
    "soluble_fiber_g",
    "insoluble_fiber_g",
    "total_sugars_g",
    "added_sugars_g",
    "protein_g",
    "calcium_mg",
    "iron_mg",
    "potassium_mg",
    "vitamin_a_mcg",
    "vitamin_c_mg",
)


@dataclass
class FoodItem:
    """One recipe, identified by the college's own stable recipe id."""

    college: str
    external_id: str
    name: str
    serving_size: str | None = None
    ingredients: str | None = None
    #: Canonical allergen names merged from every source (see dining.allergens).
    allergens: list[str] = field(default_factory=list)
    #: Exactly what the label page said, kept for auditing.
    allergens_raw: list[str] = field(default_factory=list)
    diets: list[str] = field(default_factory=list)
    #: False means "nobody told us", which is NOT the same as "contains nothing".
    has_allergen_data: bool = False
    nutrients: dict[str, float] = field(default_factory=dict)
    daily_values: dict[str, int] = field(default_factory=dict)
    source_url: str | None = None

    def as_row(self) -> dict:
        row = {
            "college": self.college,
            "external_id": self.external_id,
            "name": self.name,
            "serving_size": self.serving_size,
            "ingredients": self.ingredients,
            "source_url": self.source_url,
        }
        row.update({f: self.nutrients.get(f) for f in NUTRIENT_FIELDS})
        return row


@dataclass
class MenuEntry:
    """A food item appearing at a hall, on a date, during a meal, at a station."""

    college: str
    location_id: str
    location_name: str
    service_date: date
    meal: str
    station: str | None
    item_external_id: str
    portion: str | None = None
    #: Legend icons shown on this row (Vegan, Halal Friendly, Contains gluten...).
    tags: list[str] = field(default_factory=list)
