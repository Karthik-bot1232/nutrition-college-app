/* Shapes returned by dining.serve (dining/serve.py). Every endpoint is a GET
   returning JSON; these mirror `_item_json`, `_placement` and the api_* dicts. */

export type Nutrients = Record<string, number | null>;

/** One entry of /api/colleges: a campus with menus stored. */
export interface College {
  slug: string;
  name: string;
  locations: number;
  days: number;
}

export interface Placement {
  date: string;
  meal: string;
  location_id: string;
  location_name: string;
  station: string | null;
  portion: string | null;
  menu_tags: string[];
}

export interface Item {
  recipe_id: string;
  name: string;
  serving_size: string | null;
  calories: number | null;
  nutrients: Nutrients;
  allergens: string[];
  allergen_data_published: boolean;
  diets: string[];
  has_nutrition: boolean;
  nutrition_suspect: boolean;
  label_implausible: boolean;
  /** Menu rows only. */
  portion?: string | null;
  menu_tags?: string[];
  /** Search results and the detail endpoint. */
  served_at?: Placement[];
}

export interface DetailItem extends Item {
  allergens_as_published: string[];
  ingredients: string | null;
  source_url: string | null;
  fetched_at: string | null;
  served_at: Placement[];
}

export interface Station {
  station: string;
  items: Item[];
}

export interface HallMenu {
  location_id: string;
  location_name: string;
  count: number;
  stations: Station[];
}

export interface Menu {
  date: string;
  meal: string;
  location_id: string;
  count: number;
  locations: HallMenu[];
}

export type Hours = Record<string, [string, string]>;

export interface Meta {
  college: string;
  college_name: string;
  locations: { id: string; name: string }[];
  meals: string[];
  hours: { weekday?: Hours; weekend?: Hours } | null;
  dates: string[];
  today: string;
  allergens: string[];
  counts: Record<string, number>;
  demo?: boolean;
}

export interface SearchResult {
  count: number;
  hidden_unknown_allergens: boolean;
  items: Item[];
  error?: string;
}

export interface Stats {
  recipes: number;
  menu_rows: number;
  days: number;
  first_date: string;
  last_date: string;
  without_nutrition: number;
  without_allergen_data: number;
  nutrition_suspect: number;
  label_implausible: number;
  last_fetched: string | null;
  per_meal: { location_name: string; meal: string; n: number }[];
}

export type Unit = 'serving' | 'oz' | 'g';

/** An amount as the person entered it. */
export interface Portion {
  unit: Unit;
  amount: number;
}

/** One logged item. Stored, so the field names match the web app's. */
export interface PlateRow {
  recipe_id: string;
  name: string;
  serving: string | null;
  /** Servings eaten: what every total multiplies by, whatever unit was typed. */
  qty: number;
  /** How the amount was entered. Absent on rows logged before weights, which are servings. */
  unit?: Unit;
  amount?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  implausible: boolean;
}

export type DayPlates = Record<string, PlateRow[]>;

export interface Fav {
  name: string;
  calories: number | null;
  protein: number | null;
  added: number;
}

export interface Profile {
  diets: string[];
  without: string[];
  includeUnknown: boolean;
}

/** As typed into the targets sheet: '' means "use the default". */
export interface Goals {
  calories: string;
  protein: string;
  maxCarbs: string;
  maxFat: string;
  dayCalories: string;
  dayProtein: string;
  water: string;
}

export interface ActiveGoal {
  calories: number;
  protein: number;
  maxCarbs: number;
  maxFat: number;
  dayCalories: number;
  dayProtein: number;
  water: number;
  isDefault: boolean;
}
