"""University of Maryland — CBORD FoodPro web menus at nutrition.umd.edu.

Menus and labels are server-rendered HTML reachable by plain GET parameters,
so every nutrient is read as text. No vision model, no browser automation.
"""

import re
import sys
from datetime import date

from bs4 import BeautifulSoup

from ..allergens import normalize_all
from ..models import FoodItem, MenuEntry
from .base import CollegeAdapter

BASE = "https://nutrition.umd.edu"

# Nutrient captions as FoodPro renders them -> our schema field.
NUTRIENT_MAP = {
    "total fat": "total_fat_g",
    "saturated fat": "saturated_fat_g",
    "trans fat": "trans_fat_g",
    "cholesterol": "cholesterol_mg",
    "sodium": "sodium_mg",
    "total carbohydrate": "total_carbs_g",
    "carbohydrates": "total_carbs_g",
    "dietary fiber": "dietary_fiber_g",
    "soluble fiber": "soluble_fiber_g",
    "insoluble fiber": "insoluble_fiber_g",
    "total sugars": "total_sugars_g",
    "added sugars": "added_sugars_g",
    "protein": "protein_g",
    "calcium": "calcium_mg",
    "iron": "iron_mg",
    "potassium": "potassium_mg",
    "vitamin a - re": "vitamin_a_mcg",
    "vitamin c": "vitamin_c_mg",
    "calories": "calories",
    "fat": "total_fat_g",
}

NUTRIENT_RE = re.compile(r"^(?P<name>[a-z][a-z \-]*?)\.?\s+(?P<amount>[\d.]+)\s*(?P<unit>kcal|mcg|mg|g)$")
ADDED_SUGARS_RE = re.compile(r"includes\s+(?P<amount>[\d.]+)\s*g\s+added sugars")
PERCENT_RE = re.compile(r"^(\d+)%$")


def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("\xa0", " ")).strip()


class UMDAdapter(CollegeAdapter):
    slug = "umd"
    name = "University of Maryland"
    locations = {
        "16": "South Campus Dining Hall",
        "19": "Yahentamitsi Dining Hall",
        "51": "251 North",
    }
    meals = ("Breakfast", "Lunch", "Dinner")
    # Typical semester schedule; check dining.umd.edu before relying on it.
    hours = {
        "weekday": {"Breakfast": ("07:00", "10:30"), "Lunch": ("11:00", "16:00"),
                    "Dinner": ("16:00", "21:00")},
        "weekend": {"Breakfast": ("08:00", "10:00"), "Lunch": ("10:00", "16:00"),
                    "Dinner": ("16:00", "20:00")},
    }

    def menu_url(self, location_id: str, day: date, meal: str) -> str:
        return (
            f"{BASE}/longmenu.aspx?locationNum={location_id}"
            f"&dtdate={day.strftime('%m/%d/%Y')}&mealName={meal}"
        )

    def label_url(self, location_id: str, day: date, external_id: str) -> str:
        return (
            f"{BASE}/label.aspx?locationNum={location_id}&locationName="
            f"&dtdate={day.strftime('%m/%d/%Y')}&RecNumAndPort={external_id}"
        )

    def parse_menu(self, html: str, location_id: str, day: date, meal: str) -> list[MenuEntry]:
        soup = BeautifulSoup(html, "html.parser")
        table = soup.find("table", id="long-menu-table")
        if table is None:
            return []

        entries: list[MenuEntry] = []
        station: str | None = None
        for row in table.find_all("tr"):
            cells = row.find_all("td")
            if not cells:
                continue

            link = cells[0].find("a", href=re.compile(r"label\.aspx"))
            if link is None:
                # Station header rows carry a bold caption and no item link.
                heading = cells[0].find("strong")
                if heading is not None:
                    station = _clean(heading.get_text()) or None
                continue

            match = re.search(r"RecNumAndPort=([^&\"']+)", link["href"])
            if match is None:
                continue

            portion = None
            for cell in cells[1:]:
                holder = cell.find("div", class_="longmenucolportions")
                if holder is not None:
                    portion = _clean(holder.get_text()) or None

            tags = sorted({
                _clean(img.get("title") or img.get("alt"))
                for img in cells[0].find_all("img")
                if img.get("title") or img.get("alt")
            })

            entries.append(
                MenuEntry(
                    college=self.slug,
                    location_id=location_id,
                    location_name=self.locations[location_id],
                    service_date=day,
                    meal=meal,
                    station=station,
                    item_external_id=match.group(1),
                    portion=portion,
                    tags=tags,
                )
            )
        return entries

    def parse_label(self, html: str, external_id: str, source_url: str) -> FoodItem:
        soup = BeautifulSoup(html, "html.parser")

        heading = soup.find("h1")
        item = FoodItem(
            college=self.slug,
            external_id=external_id,
            name=_clean(heading.get_text()) if heading else "",
            source_url=source_url,
        )

        # Serving size: the caption div is followed by a div holding the value.
        size_divs = [_clean(d.get_text()) for d in soup.find_all("div", class_="nutfactsservsize")]
        values = [d for d in size_divs if d.lower() != "serving size"]
        if values:
            item.serving_size = values[0]

        spans = [_clean(s.get_text()) for s in soup.select("span.nutfactstopnutrient")]
        for index, text in enumerate(spans):
            lowered = text.lower()

            sugars = ADDED_SUGARS_RE.search(lowered)
            if sugars is not None:
                item.nutrients.setdefault("added_sugars_g", float(sugars.group("amount")))
                continue

            match = NUTRIENT_RE.match(lowered)
            if match is None:
                continue

            field_name = NUTRIENT_MAP.get(match.group("name").strip())
            if field_name is None:
                continue

            # The label panel is rendered before the detail list, so its
            # rounded values win and the detail list only fills the gaps.
            if field_name in item.nutrients:
                continue
            item.nutrients[field_name] = float(match.group("amount"))

            if index + 1 < len(spans):
                percent = PERCENT_RE.match(spans[index + 1])
                if percent is not None:
                    item.daily_values[field_name] = int(percent.group(1))

        if "calories" not in item.nutrients:
            caption = soup.find(string=re.compile(r"Calories per serving", re.I))
            if caption is not None:
                for sibling in caption.find_parent().find_next_siblings("p"):
                    value = _clean(sibling.get_text())
                    if value.replace(".", "", 1).isdigit():
                        item.nutrients["calories"] = float(value)
                        break

        ingredients = soup.find("span", class_="labelingredientsvalue")
        if ingredients is not None:
            item.ingredients = _clean(ingredients.get_text()) or None

        allergens = soup.find("span", class_="labelallergensvalue")
        if allergens is not None:
            raw = _clean(allergens.get_text())
            terms = [a.strip() for a in re.split(r"[,;]", raw) if a.strip()]
            if terms:
                item.allergens_raw = terms
                item.allergens, unknown = normalize_all(terms)
                item.has_allergen_data = True
                if unknown:
                    print(f"  unmapped allergen {unknown} on {item.name!r}", file=sys.stderr)

        return item
