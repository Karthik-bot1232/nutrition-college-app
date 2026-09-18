// Mock menu data shaped to the API schema. Sampled from real published
// University of Maryland menus so the screens are exercised by the messiness
// of actual dining-hall data -- missing nutrients, unpublished allergens,
// stations that are mostly condiments -- rather than tidy invented rows.

export const DINING_HALLS = [
  "251 North",
  "South Campus Dining Hall",
  "Yahentamitsi Dining Hall"
];

export const MEAL_PERIODS = [
  "Breakfast",
  "Lunch",
  "Dinner"
];

export const ALLERGENS = [
  "alcohol",
  "coconut",
  "dairy",
  "eggs",
  "fish",
  "gluten",
  "pea_protein",
  "peanuts",
  "pork",
  "sesame",
  "shellfish",
  "soy",
  "tree_nuts"
];

export const DIETARY_TAGS = [
  "halal",
  "vegan",
  "vegetarian"
];

export const MENU_ITEMS = [
  {
    "id": "119370*1-16-Br",
    "name": "French Toast",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Broiler Works",
    "servingSize": "1 ea",
    "calories": 251,
    "protein": 10.9,
    "carbs": 26.0,
    "fat": 10.5,
    "fiber": 2.0,
    "sugar": 6.8,
    "sodium": 307.7,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090432*3-16-Br",
    "name": "Apple Filling",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Broiler Works Sides",
    "servingSize": "3 oz",
    "calories": 80,
    "protein": 0.0,
    "carbs": 20.0,
    "fat": 0.0,
    "fiber": 1.0,
    "sugar": 17.0,
    "sodium": 50.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "220065*1-16-Br",
    "name": "Butter",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Broiler Works Sides",
    "servingSize": "1 oz",
    "calories": 202,
    "protein": 0.0,
    "carbs": 0.0,
    "fat": 22.3,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 0.0,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102012*1-16-Br",
    "name": "Cherry Filling",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Broiler Works Sides",
    "servingSize": "1 oz",
    "calories": 33,
    "protein": 0.0,
    "carbs": 8.7,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 4.7,
    "sodium": 10.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220066*1-16-Br",
    "name": "Margarine",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Broiler Works Sides",
    "servingSize": "1 oz",
    "calories": 202,
    "protein": 0.0,
    "carbs": 0.0,
    "fat": 22.3,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 212.6,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "119363*1-16-Br",
    "name": "Pancake Syrup",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Broiler Works Sides",
    "servingSize": "1 oz",
    "calories": 58,
    "protein": 0.0,
    "carbs": 15.0,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 14.4,
    "sodium": 66.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "040064*4-16-Br",
    "name": "Scrambled Eggs Tomato Pepper Jack Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Chef's Table",
    "servingSize": "4 oz",
    "calories": 213,
    "protein": 16.2,
    "carbs": 1.4,
    "fat": 15.3,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 194.2,
    "allergens": [
      "dairy",
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "040060*4-16-Br",
    "name": "Scrambled Eggs",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Chef's Table",
    "servingSize": "4 oz",
    "calories": 192,
    "protein": 15.0,
    "carbs": 1.2,
    "fat": 13.7,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 161.3,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "040067*4-16-Br",
    "name": "Scrambled Egg Whites",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Chef's Table",
    "servingSize": "4 oz",
    "calories": 72,
    "protein": 12.5,
    "carbs": 1.1,
    "fat": 1.8,
    "fiber": 0.0,
    "sugar": 1.1,
    "sodium": 192.8,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "060063*1-16-Br",
    "name": "Pork Sausage Link",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Chef's Table",
    "servingSize": "1 ea",
    "calories": 189,
    "protein": 8.0,
    "carbs": 2.0,
    "fat": 16.9,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 517.3,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "040066*1-16-Br",
    "name": "Hard Boiled Egg (Breakfast)",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Chef's Table",
    "servingSize": "1 each",
    "calories": 79,
    "protein": 6.8,
    "carbs": 0.0,
    "fat": 5.7,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 79.4,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "040063*1-16-Br",
    "name": "Over Hard Fried Eggs",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Chef's Table",
    "servingSize": "1 ea",
    "calories": 90,
    "protein": 6.8,
    "carbs": 0.0,
    "fat": 6.8,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 79.4,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150942*3-16-Br",
    "name": "Mushroom, Spinach & Tomato Vegetable Hash",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Chef's Table Sides",
    "servingSize": "3 oz",
    "calories": 111,
    "protein": 9.2,
    "carbs": 13.7,
    "fat": 5.0,
    "fiber": 5.2,
    "sugar": 1.7,
    "sodium": 371.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "019382*1-16-Br",
    "name": "Grilled Croissant",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Chef's Table Sides",
    "servingSize": "1 each",
    "calories": 236,
    "protein": 4.0,
    "carbs": 24.9,
    "fat": 12.8,
    "fiber": 1.0,
    "sugar": 2.0,
    "sodium": 1.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220085*1-16-Br",
    "name": "Cheddar Cheese Sliced",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Chef's Table Sides",
    "servingSize": "1 each",
    "calories": 54,
    "protein": 3.4,
    "carbs": 0.0,
    "fat": 4.7,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 94.5,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220082*1-16-Br",
    "name": "American Cheese Sliced",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Chef's Table Sides",
    "servingSize": "1 each",
    "calories": 56,
    "protein": 3.0,
    "carbs": 0.5,
    "fat": 4.6,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 182.3,
    "allergens": [
      "dairy",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "141142*1-16-Br",
    "name": "Hash Browns Rounds",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Chef's Table Sides",
    "servingSize": "1 oz",
    "calories": 50,
    "protein": 0.5,
    "carbs": 6.8,
    "fat": 3.2,
    "fiber": 0.9,
    "sugar": 0.0,
    "sodium": 108.0,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100208*1-16-Br",
    "name": "Vegan Pancake Gluten Free",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone",
    "servingSize": "1 each",
    "calories": 128,
    "protein": 2.5,
    "carbs": 22.6,
    "fat": 3.0,
    "fiber": 0.7,
    "sugar": 3.4,
    "sodium": 119.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100213*2-16-Br",
    "name": "Vegan Vanilla Soy-Free Yogurt",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone Sides",
    "servingSize": "2 oz",
    "calories": 53,
    "protein": 2.3,
    "carbs": 7.9,
    "fat": 1.3,
    "fiber": 0.8,
    "sugar": 6.0,
    "sodium": 34.0,
    "allergens": [
      "coconut"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "141123*4-16-Br",
    "name": "Breakfast Potatoes w/ Peppers & Onions",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone Sides",
    "servingSize": "4 oz",
    "calories": 69,
    "protein": 1.8,
    "carbs": 14.9,
    "fat": 0.4,
    "fiber": 1.7,
    "sugar": 1.8,
    "sodium": 38.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "101050*1-16-Br",
    "name": "Strawberry Compote",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone Sides",
    "servingSize": "1 oz",
    "calories": 32,
    "protein": 0.2,
    "carbs": 7.7,
    "fat": 0.0,
    "fiber": 0.3,
    "sugar": 6.8,
    "sodium": 0.2,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220136*1-16-Br",
    "name": "Earth Balance Soy Free Spread",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone Sides",
    "servingSize": "1 oz",
    "calories": 202,
    "protein": 0.0,
    "carbs": 0.0,
    "fat": 22.3,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 222.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220127*1-16-Br",
    "name": "Pancake Syrup",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone Sides",
    "servingSize": "1 each",
    "calories": 0,
    "protein": 0.0,
    "carbs": 30.6,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 16.8,
    "sodium": 39.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090263*2-16-Br",
    "name": "Cottage Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Salad Bar",
    "servingSize": "2 oz",
    "calories": 40,
    "protein": 5.5,
    "carbs": 3.0,
    "fat": 0.5,
    "fiber": 0.0,
    "sugar": 2.0,
    "sodium": 160.6,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090365*2-16-Br",
    "name": "Greek Yogurt",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Salad Bar",
    "servingSize": "2 oz",
    "calories": 43,
    "protein": 4.5,
    "carbs": 7.3,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 6.8,
    "sodium": 18.9,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090302*5-16-Br",
    "name": "Cereal Granola",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Salad Bar",
    "servingSize": "5 oz",
    "calories": 194,
    "protein": 3.9,
    "carbs": 41.7,
    "fat": 2.4,
    "fiber": 3.9,
    "sugar": 13.6,
    "sodium": 82.4,
    "allergens": [
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150350*3-16-Br",
    "name": "Roasted Corn",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Salad Bar",
    "servingSize": "3 oz",
    "calories": 126,
    "protein": 3.7,
    "carbs": 26.4,
    "fat": 1.5,
    "fiber": 1.3,
    "sugar": 6.1,
    "sodium": 46.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "019406*1-16-Br",
    "name": "Cubed Bread",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 71,
    "protein": 2.5,
    "carbs": 15.2,
    "fat": 0.0,
    "fiber": 0.5,
    "sugar": 0.5,
    "sodium": 172.0,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090382*3-16-Br",
    "name": "Blueberry Yogurt",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Salad Bar",
    "servingSize": "3 oz",
    "calories": 68,
    "protein": 2.3,
    "carbs": 14.3,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 11.3,
    "sodium": 37.6,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119375*1-16-Br",
    "name": "Assorted Scone",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Treats",
    "servingSize": "1 each",
    "calories": 432,
    "protein": 8.0,
    "carbs": 50.2,
    "fat": 22.1,
    "fiber": 1.0,
    "sugar": 18.1,
    "sodium": 471.7,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220090*4-16-Br",
    "name": "Yogurt Mango Pineapple Smoothie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Treats",
    "servingSize": "4 oz",
    "calories": 60,
    "protein": 4.7,
    "carbs": 6.2,
    "fat": 0.2,
    "fiber": 0.5,
    "sugar": 8.7,
    "sodium": 15.8,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119374*1-16-Br",
    "name": "Mini Croissant",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Treats",
    "servingSize": "1 each",
    "calories": 123,
    "protein": 2.5,
    "carbs": 14.8,
    "fat": 5.5,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 135.5,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220097*4-16-Br",
    "name": "Banana Coconut Spinach Smoothie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Treats",
    "servingSize": "4 oz",
    "calories": 110,
    "protein": 2.4,
    "carbs": 16.1,
    "fat": 3.2,
    "fiber": 1.1,
    "sugar": 11.7,
    "sodium": 38.9,
    "allergens": [
      "coconut",
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090328*7-16-Br",
    "name": "Waffle",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "7 oz",
    "calories": 557,
    "protein": 11.8,
    "carbs": 70.9,
    "fat": 25.3,
    "fiber": 0.0,
    "sugar": 8.4,
    "sodium": 1285.0,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119360*1-16-Br",
    "name": "Bagels",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "1 ea",
    "calories": 295,
    "protein": 10.0,
    "carbs": 60.5,
    "fat": 1.2,
    "fiber": 4.7,
    "sugar": 5.0,
    "sodium": 376.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "sesame",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090331*1-16-Br",
    "name": "Plain Cream Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 9.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 96.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "233007*8-16-Br",
    "name": "Chocolate Pea Milk",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "8 oz",
    "calories": 132,
    "protein": 7.6,
    "carbs": 14.2,
    "fat": 4.7,
    "fiber": 1.9,
    "sugar": 12.3,
    "sodium": 132.3,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "233005*8-16-Br",
    "name": "Skim Milk",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "8 oz",
    "calories": 76,
    "protein": 7.6,
    "carbs": 11.3,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 10.4,
    "sodium": 113.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "233008*8-16-Br",
    "name": "Vanilla Soy Milk",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "8 oz",
    "calories": 94,
    "protein": 7.6,
    "carbs": 8.5,
    "fat": 3.8,
    "fiber": 0.9,
    "sugar": 6.6,
    "sodium": 99.2,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "080604*4-16-Lu",
    "name": "Fresh Turkey Burger",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Broiler Works",
    "servingSize": "4 oz",
    "calories": 392,
    "protein": 26.1,
    "carbs": 32.0,
    "fat": 18.7,
    "fiber": 1.6,
    "sugar": 0.5,
    "sodium": 507.0,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "080522*1-16-Lu",
    "name": "Grilled Southwestern Chipotle Pesto Chicken Thigh",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Broiler Works",
    "servingSize": "1 each",
    "calories": 177,
    "protein": 22.4,
    "carbs": 1.4,
    "fat": 9.3,
    "fiber": 0.1,
    "sugar": 0.3,
    "sodium": 273.2,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "060181*5-16-Lu",
    "name": "Grilled jalapeno Cheddar Sausage",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Broiler Works",
    "servingSize": "5 oz",
    "calories": 373,
    "protein": 13.1,
    "carbs": 0.0,
    "fat": 29.8,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 2443.3,
    "allergens": [
      "dairy",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090271*1-16-Lu",
    "name": "Bacon Bits",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Broiler Works Sides",
    "servingSize": "1 oz",
    "calories": 127,
    "protein": 12.0,
    "carbs": 0.5,
    "fat": 8.7,
    "fiber": 0.2,
    "sugar": 0.5,
    "sodium": 603.5,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "220110*1-16-Lu",
    "name": "Spicy Brown Mustard",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Broiler Works Sides",
    "servingSize": "1 oz",
    "calories": 148,
    "protein": 7.9,
    "carbs": 11.0,
    "fat": 9.1,
    "fiber": 4.6,
    "sugar": 2.1,
    "sodium": 1.6,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "119387*1-16-Lu",
    "name": "Potato Hot Dog Roll",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Broiler Works Sides",
    "servingSize": "1 each",
    "calories": 140,
    "protein": 4.0,
    "carbs": 27.0,
    "fat": 1.5,
    "fiber": 1.0,
    "sugar": 4.0,
    "sodium": 250.0,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119388*1-16-Lu",
    "name": "Potato Hamburger Roll",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Broiler Works Sides",
    "servingSize": "1 each",
    "calories": 123,
    "protein": 3.8,
    "carbs": 22.6,
    "fat": 1.9,
    "fiber": 0.9,
    "sugar": 1.9,
    "sodium": 198.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "141119*4-16-Lu",
    "name": "Seasoned Spiral Fries",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Broiler Works Sides",
    "servingSize": "4 oz",
    "calories": 162,
    "protein": 2.1,
    "carbs": 20.3,
    "fat": 8.1,
    "fiber": 2.0,
    "sugar": 0.2,
    "sodium": 435.5,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150319*1-16-Lu",
    "name": "Grilled Mushrooms",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Broiler Works Sides",
    "servingSize": "1 oz",
    "calories": 16,
    "protein": 2.0,
    "carbs": 2.0,
    "fat": 0.3,
    "fiber": 0.7,
    "sugar": 0.0,
    "sodium": 10.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "080264*4-16-Lu",
    "name": "Chicken Picatta",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Table",
    "servingSize": "4 oz",
    "calories": 400,
    "protein": 36.5,
    "carbs": 13.1,
    "fat": 20.1,
    "fiber": 1.6,
    "sugar": 1.4,
    "sodium": 823.8,
    "allergens": [
      "alcohol",
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "150219*4-16-Lu",
    "name": "Asparagus Tomato and Fontina Fritatta",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Table",
    "servingSize": "4 oz",
    "calories": 211,
    "protein": 12.1,
    "carbs": 3.6,
    "fat": 16.0,
    "fiber": 1.1,
    "sugar": 1.7,
    "sodium": 211.6,
    "allergens": [
      "dairy",
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090017*4-16-Lu",
    "name": "Lemon Herb Baked Cod with Tomato Relish",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Table",
    "servingSize": "4 OZ",
    "calories": 182,
    "protein": 9.6,
    "carbs": 3.8,
    "fat": 14.7,
    "fiber": 0.7,
    "sugar": 1.8,
    "sodium": 360.0,
    "allergens": [
      "fish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "150277*3-16-Lu",
    "name": "Tomato Basil Lentils",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Sides",
    "servingSize": "3 oz",
    "calories": 315,
    "protein": 11.7,
    "carbs": 32.9,
    "fat": 15.8,
    "fiber": 5.8,
    "sugar": 1.3,
    "sodium": 756.4,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "115202*4-16-Lu",
    "name": "Braised Arugula Bow Tie Alfredo Pasta",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Sides",
    "servingSize": "4 oz",
    "calories": 278,
    "protein": 10.7,
    "carbs": 46.6,
    "fat": 8.2,
    "fiber": 7.1,
    "sugar": 3.2,
    "sodium": 114.4,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "115199*4-16-Lu",
    "name": "Semolina Pasta Cooked",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Sides",
    "servingSize": "4 oz",
    "calories": 142,
    "protein": 4.5,
    "carbs": 26.9,
    "fat": 2.1,
    "fiber": 1.3,
    "sugar": 1.4,
    "sodium": 1.5,
    "allergens": [
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150272*3-16-Lu",
    "name": "Italian Herb Corn",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Sides",
    "servingSize": "3 OZ",
    "calories": 216,
    "protein": 4.2,
    "carbs": 26.5,
    "fat": 11.3,
    "fiber": 2.2,
    "sugar": 7.6,
    "sodium": 480.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "141143*3-16-Lu",
    "name": "Au Gratin Potatoes",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Sides",
    "servingSize": "3 oz",
    "calories": 205,
    "protein": 3.8,
    "carbs": 7.5,
    "fat": 16.3,
    "fiber": 0.6,
    "sugar": 0.0,
    "sodium": 338.5,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "100306*3-16-Lu",
    "name": "Tomato Garlic Barley",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Sides",
    "servingSize": "3 OZ",
    "calories": 113,
    "protein": 3.3,
    "carbs": 24.3,
    "fat": 0.8,
    "fiber": 4.6,
    "sugar": 2.1,
    "sodium": 263.7,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "080086*4-16-Lu",
    "name": "Chargrilled Seasoned Chicken Breast",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Deli",
    "servingSize": "4 OZ",
    "calories": 150,
    "protein": 22.0,
    "carbs": 1.3,
    "fat": 5.9,
    "fiber": 0.2,
    "sugar": 0.1,
    "sodium": 104.7,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "903038*4-16-Lu",
    "name": "Green Goddess Chicken Salad",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Deli",
    "servingSize": "4 OZ",
    "calories": 181,
    "protein": 20.3,
    "carbs": 3.1,
    "fat": 9.5,
    "fiber": 0.4,
    "sugar": 0.5,
    "sodium": 502.7,
    "allergens": [
      "dairy",
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "126379*3-16-Lu",
    "name": "Ham Sliced",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Deli",
    "servingSize": "3 oz",
    "calories": 106,
    "protein": 13.7,
    "carbs": 4.6,
    "fat": 3.0,
    "fiber": 0.0,
    "sugar": 4.6,
    "sodium": 1002.4,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "126378*3-16-Lu",
    "name": "Turkey Sliced",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Deli",
    "servingSize": "3 oz",
    "calories": 76,
    "protein": 13.7,
    "carbs": 1.5,
    "fat": 1.5,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 683.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "126380*3-16-Lu",
    "name": "Tuna Salad",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Deli",
    "servingSize": "3 oz",
    "calories": 130,
    "protein": 12.6,
    "carbs": 2.3,
    "fat": 7.9,
    "fiber": 0.1,
    "sugar": 0.3,
    "sodium": 321.6,
    "allergens": [
      "eggs",
      "fish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "150295*2-16-Lu",
    "name": "Crispy Chickpeas",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Deli",
    "servingSize": "2 OZ",
    "calories": 226,
    "protein": 9.5,
    "carbs": 30.7,
    "fat": 7.9,
    "fiber": 8.5,
    "sugar": 5.5,
    "sodium": 89.7,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126632*1-16-Lu",
    "name": "Spicy Crispy BBQ Chicken Tacos",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Deli+",
    "servingSize": "1 each",
    "calories": 318,
    "protein": 18.5,
    "carbs": 31.6,
    "fat": 12.9,
    "fiber": 2.1,
    "sugar": 8.7,
    "sodium": 1215.7,
    "allergens": [
      "dairy",
      "gluten",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "126634*1-16-Lu",
    "name": "BBQ Mushroom and Black Bean Taco",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Deli+",
    "servingSize": "1 each",
    "calories": 185,
    "protein": 9.1,
    "carbs": 22.6,
    "fat": 6.6,
    "fiber": 2.7,
    "sugar": 2.7,
    "sodium": 584.7,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220137*1-16-Lu",
    "name": "Cotija Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Deli+",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 6.1,
    "carbs": 0.0,
    "fat": 8.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 435.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "151082*3-16-Lu",
    "name": "Borracho Beans Frijoles Borrachos",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Deli+",
    "servingSize": "3 OZ",
    "calories": 86,
    "protein": 4.3,
    "carbs": 9.3,
    "fat": 3.0,
    "fiber": 1.9,
    "sugar": 0.9,
    "sodium": 300.7,
    "allergens": [
      "alcohol",
      "gluten",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "145215*4-16-Lu",
    "name": "Peruvian Arrocito",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Deli+",
    "servingSize": "4 oz",
    "calories": 148,
    "protein": 3.3,
    "carbs": 23.3,
    "fat": 4.9,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 282.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220073*1-16-Lu",
    "name": "6\" Flour Tortilla",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Deli+",
    "servingSize": "1 each",
    "calories": 90,
    "protein": 3.0,
    "carbs": 15.0,
    "fat": 2.0,
    "fiber": 1.0,
    "sugar": 0.0,
    "sodium": 220.0,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126666*1-16-Lu",
    "name": "Pepperoni Pizza Quesadilla",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Grill Works",
    "servingSize": "1 each",
    "calories": 809,
    "protein": 40.7,
    "carbs": 59.6,
    "fat": 48.7,
    "fiber": 6.1,
    "sugar": 4.1,
    "sodium": 1909.0,
    "allergens": [
      "dairy",
      "gluten",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "126726*1-16-Lu",
    "name": "Vegetable Pizza Quesadilla",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Grill Works",
    "servingSize": "1 each",
    "calories": 661,
    "protein": 36.7,
    "carbs": 65.4,
    "fat": 32.4,
    "fiber": 7.2,
    "sugar": 6.0,
    "sodium": 1323.9,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "126386*1-16-Lu",
    "name": "Cheese Quesadilla",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Grill Works",
    "servingSize": "1 each",
    "calories": 667,
    "protein": 30.3,
    "carbs": 55.5,
    "fat": 37.6,
    "fiber": 5.0,
    "sugar": 1.0,
    "sodium": 1223.2,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "145176*3-16-Lu",
    "name": "Citrus Cilantro Orange Rice",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Grill Works Sides",
    "servingSize": "3 OZ",
    "calories": 121,
    "protein": 2.9,
    "carbs": 26.3,
    "fat": 0.0,
    "fiber": 0.2,
    "sugar": 1.0,
    "sodium": 8.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150349*3-16-Lu",
    "name": "Spicy Black Beans",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Grill Works Sides",
    "servingSize": "3 oz",
    "calories": 47,
    "protein": 2.7,
    "carbs": 7.5,
    "fat": 0.5,
    "fiber": 2.6,
    "sugar": 0.6,
    "sodium": 136.2,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "161115*3-16-Lu",
    "name": "Platanos Calados Plantains & Brown Sugar Syrup",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Grill Works Sides",
    "servingSize": "3 oz",
    "calories": 216,
    "protein": 1.7,
    "carbs": 42.5,
    "fat": 4.3,
    "fiber": 1.7,
    "sugar": 34.0,
    "sodium": 21.3,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220052*1-16-Lu",
    "name": "Picante Sauce",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Grill Works Sides",
    "servingSize": "1 oz",
    "calories": 18,
    "protein": 0.0,
    "carbs": 5.6,
    "fat": 0.0,
    "fiber": 1.9,
    "sugar": 3.7,
    "sodium": 462.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "080185*4-16-Lu",
    "name": "Mushroom Chicken",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mongolian Grill",
    "servingSize": "4 oz",
    "calories": 90,
    "protein": 13.4,
    "carbs": 4.9,
    "fat": 1.8,
    "fiber": 0.8,
    "sugar": 1.5,
    "sodium": 306.0,
    "allergens": [
      "gluten",
      "sesame",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "115259*4-16-Lu",
    "name": "Asian Garlic Noodles",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mongolian Grill",
    "servingSize": "4 oz",
    "calories": 376,
    "protein": 8.9,
    "carbs": 54.1,
    "fat": 13.6,
    "fiber": 1.5,
    "sugar": 8.9,
    "sodium": 569.3,
    "allergens": [
      "dairy",
      "gluten",
      "shellfish",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "145219*4-16-Lu",
    "name": "Mushroom Jasmine Rice",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mongolian Grill",
    "servingSize": "4 oz",
    "calories": 204,
    "protein": 3.9,
    "carbs": 39.5,
    "fat": 3.7,
    "fiber": 0.8,
    "sugar": 0.9,
    "sodium": 259.9,
    "allergens": [
      "alcohol",
      "gluten",
      "sesame",
      "shellfish",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "220191*1-16-Lu",
    "name": "Chow Mein Noodles",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mongolian Grill",
    "servingSize": "1 oz",
    "calories": 132,
    "protein": 3.0,
    "carbs": 18.2,
    "fat": 6.1,
    "fiber": 2.0,
    "sugar": 0.0,
    "sodium": 263.3,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100329*4-16-Lu",
    "name": "Brown Rice",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mongolian Grill",
    "servingSize": "4 oz",
    "calories": 134,
    "protein": 2.7,
    "carbs": 28.3,
    "fat": 1.0,
    "fiber": 1.3,
    "sugar": 0.0,
    "sodium": 41.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220192*1-16-Lu",
    "name": "Fried Wonton Strips",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mongolian Grill",
    "servingSize": "1 oz",
    "calories": 82,
    "protein": 2.7,
    "carbs": 16.8,
    "fat": 0.4,
    "fiber": 0.5,
    "sugar": 0.0,
    "sodium": 162.1,
    "allergens": [
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "080286*4-16-Lu",
    "name": "Asian Chicken Mongolian Grill",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mongolian Grill Made to Ord",
    "servingSize": "4 oz",
    "calories": 125,
    "protein": 26.3,
    "carbs": 0.0,
    "fat": 1.4,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 74.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "050181*4-16-Lu",
    "name": "Asian Beef Mongolian Grill",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mongolian Grill Made to Ord",
    "servingSize": "4 oz",
    "calories": 243,
    "protein": 22.7,
    "carbs": 0.0,
    "fat": 15.9,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 57.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "090173*4-16-Lu",
    "name": "Asian Shrimp Mongolian Grill",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mongolian Grill Made to Ord",
    "servingSize": "4 oz",
    "calories": 84,
    "protein": 17.8,
    "carbs": 0.0,
    "fat": 0.9,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 190.5,
    "allergens": [
      "shellfish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090268*2-16-Lu",
    "name": "Tofu",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mongolian Grill Made to Ord",
    "servingSize": "2 OZ",
    "calories": 81,
    "protein": 9.3,
    "carbs": 1.9,
    "fat": 4.9,
    "fiber": 0.6,
    "sugar": 0.0,
    "sodium": 3.1,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "115250*4-16-Lu",
    "name": "Pad Thai Noodle Mongolian Grill",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mongolian Grill Made to Ord",
    "servingSize": "4 oz",
    "calories": 405,
    "protein": 6.1,
    "carbs": 93.2,
    "fat": 0.0,
    "fiber": 4.1,
    "sugar": 0.0,
    "sodium": 40.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "115188*4-16-Lu",
    "name": "Cooked Lo Mein",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mongolian Grill Made to Ord",
    "servingSize": "4 OZ",
    "calories": 125,
    "protein": 4.8,
    "carbs": 23.7,
    "fat": 1.3,
    "fiber": 0.6,
    "sugar": 0.3,
    "sodium": 101.1,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "040065*4-16-Lu",
    "name": "Scrambled Cheesy Cheddar Egg",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Pasta",
    "servingSize": "4 oz",
    "calories": 214,
    "protein": 16.4,
    "carbs": 1.2,
    "fat": 15.5,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 198.3,
    "allergens": [
      "dairy",
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "040060*4-16-Lu",
    "name": "Scrambled Eggs",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Pasta",
    "servingSize": "4 oz",
    "calories": 192,
    "protein": 15.0,
    "carbs": 1.2,
    "fat": 13.7,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 161.3,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "060063*1-16-Lu",
    "name": "Pork Sausage Link",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Pasta",
    "servingSize": "1 ea",
    "calories": 189,
    "protein": 8.0,
    "carbs": 2.0,
    "fat": 16.9,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 517.3,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "040063*1-16-Lu",
    "name": "Over Hard Fried Eggs",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Pasta",
    "servingSize": "1 ea",
    "calories": 90,
    "protein": 6.8,
    "carbs": 0.0,
    "fat": 6.8,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 79.4,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "141142*1-16-Lu",
    "name": "Hash Browns Rounds",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Pasta",
    "servingSize": "1 oz",
    "calories": 50,
    "protein": 0.5,
    "carbs": 6.8,
    "fat": 3.2,
    "fiber": 0.9,
    "sugar": 0.0,
    "sodium": 108.0,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "117127*1-16-Lu",
    "name": "Pan BBQ Chicken Pizza",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Pizza",
    "servingSize": "1 slice",
    "calories": 496,
    "protein": 26.6,
    "carbs": 48.4,
    "fat": 22.5,
    "fiber": 8.6,
    "sugar": 27.2,
    "sodium": 1545.0,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "117118*1-16-Lu",
    "name": "Pan Italian Sausage Pizza",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Pizza",
    "servingSize": "1 slice",
    "calories": 471,
    "protein": 20.8,
    "carbs": 45.0,
    "fat": 23.3,
    "fiber": 8.6,
    "sugar": 25.0,
    "sodium": 1358.3,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "117117*1-16-Lu",
    "name": "Pan Vegetable Pizza",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Pizza",
    "servingSize": "1 slice",
    "calories": 452,
    "protein": 20.3,
    "carbs": 45.7,
    "fat": 21.3,
    "fiber": 8.8,
    "sugar": 25.2,
    "sodium": 1284.9,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117116*1-16-Lu",
    "name": "Pan Cheese Pizza",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Pizza",
    "servingSize": "1 slice",
    "calories": 449,
    "protein": 20.0,
    "carbs": 45.0,
    "fat": 21.3,
    "fiber": 8.6,
    "sugar": 25.0,
    "sodium": 1284.0,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117115*1-16-Lu",
    "name": "Pan Pepperoni Pizza",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Pizza",
    "servingSize": "1 slice",
    "calories": 276,
    "protein": 18.5,
    "carbs": 14.2,
    "fat": 18.7,
    "fiber": 0.8,
    "sugar": 1.8,
    "sodium": 656.4,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "080858*4-16-Lu",
    "name": "Szechuan Chicken",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Purple Zone",
    "servingSize": "4 oz",
    "calories": 127,
    "protein": 17.1,
    "carbs": 7.0,
    "fat": 3.7,
    "fiber": 0.2,
    "sugar": 5.7,
    "sodium": 292.8,
    "allergens": [
      "alcohol",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "060142*4-16-Lu",
    "name": "Sweet & Sour Pork",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Purple Zone",
    "servingSize": "4 oz",
    "calories": 286,
    "protein": 12.7,
    "carbs": 8.4,
    "fat": 22.0,
    "fiber": 0.1,
    "sugar": 6.8,
    "sodium": 147.5,
    "allergens": [
      "alcohol",
      "pea_protein",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "101019*4-16-Lu",
    "name": "Red Lentil Penne Pasta",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Purple Zone Sides",
    "servingSize": "4 oz",
    "calories": 170,
    "protein": 9.6,
    "carbs": 25.1,
    "fat": 5.3,
    "fiber": 4.4,
    "sugar": 0.7,
    "sodium": 211.3,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "145238*3-16-Lu",
    "name": "Jasmine Rice",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Purple Zone Sides",
    "servingSize": "3 oz",
    "calories": 106,
    "protein": 1.9,
    "carbs": 23.3,
    "fat": 0.3,
    "fiber": 0.3,
    "sugar": 0.0,
    "sodium": 30.2,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "019360*1-16-Lu",
    "name": "Millet & Chia Burger Buns",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Purple Zone Sides",
    "servingSize": "1 EACH",
    "calories": 264,
    "protein": 1.9,
    "carbs": 34.9,
    "fat": 12.2,
    "fiber": 4.7,
    "sugar": 0.9,
    "sodium": 263.8,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151312*3-16-Lu",
    "name": "Red Chili Garlic Green Beans",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Purple Zone Sides",
    "servingSize": "3 oz",
    "calories": 35,
    "protein": 1.2,
    "carbs": 6.4,
    "fat": 1.1,
    "fiber": 2.3,
    "sugar": 1.5,
    "sodium": 219.2,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "019359*2-16-Lu",
    "name": "Sliced White Bread",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Purple Zone Sides",
    "servingSize": "2 EACH",
    "calories": 155,
    "protein": 0.9,
    "carbs": 32.8,
    "fat": 3.6,
    "fiber": 3.6,
    "sugar": 4.6,
    "sodium": 2.0,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151314*3-16-Lu",
    "name": "Cabbage Stir Fry",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Purple Zone Sides",
    "servingSize": "3 oz",
    "calories": 60,
    "protein": 0.8,
    "carbs": 9.2,
    "fat": 2.6,
    "fiber": 0.7,
    "sugar": 6.2,
    "sodium": 224.6,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "080051*4-16-Lu",
    "name": "Old bay Chicken Pot Pie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roaster",
    "servingSize": "4 oz",
    "calories": 970,
    "protein": 34.9,
    "carbs": 151.7,
    "fat": 36.4,
    "fiber": 23.9,
    "sugar": 12.2,
    "sodium": 602.3,
    "allergens": [
      "dairy",
      "gluten",
      "peanuts",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090018*3-16-Lu",
    "name": "Chesapeake mac and cheese with crab dust",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roaster Sides",
    "servingSize": "3 OZ",
    "calories": 200,
    "protein": 11.6,
    "carbs": 18.8,
    "fat": 9.6,
    "fiber": 0.5,
    "sugar": 2.0,
    "sodium": 286.4,
    "allergens": [
      "dairy",
      "gluten",
      "shellfish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "150155*3-16-Lu",
    "name": "Parmesan Crusted roasted Potatoes",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roaster Sides",
    "servingSize": "3 oz",
    "calories": 183,
    "protein": 6.3,
    "carbs": 21.3,
    "fat": 8.5,
    "fiber": 2.2,
    "sugar": 1.7,
    "sodium": 245.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150154*3-16-Lu",
    "name": "sweet corn hush puppies",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roaster Sides",
    "servingSize": "3 oz",
    "calories": 175,
    "protein": 5.4,
    "carbs": 37.0,
    "fat": 1.9,
    "fiber": 3.9,
    "sugar": 3.8,
    "sodium": 22.9,
    "allergens": [
      "dairy",
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150152*3-16-Lu",
    "name": "Zucchini and Fresh Corn Succotash",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roaster Sides",
    "servingSize": "3 oz",
    "calories": 172,
    "protein": 5.4,
    "carbs": 25.6,
    "fat": 7.2,
    "fiber": 4.1,
    "sugar": 2.4,
    "sodium": 1924.6,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150874*3-16-Lu",
    "name": "Italian Roasted Brussel Sprouts",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roaster Sides",
    "servingSize": "3 oz",
    "calories": 49,
    "protein": 3.0,
    "carbs": 8.1,
    "fat": 1.4,
    "fiber": 3.3,
    "sugar": 2.0,
    "sodium": 58.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "141110*4-16-Lu",
    "name": "Chef's Fresh Mashed Potatoes",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roaster Sides",
    "servingSize": "4 oz",
    "calories": 107,
    "protein": 2.3,
    "carbs": 18.8,
    "fat": 2.2,
    "fiber": 1.4,
    "sugar": 0.2,
    "sodium": 17.0,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "100346*4-16-Lu",
    "name": "Vegan Szechuan Chicken w/ Red Onion, Nappa Cabbage & Peppers",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roma Vegan Salads and Panini",
    "servingSize": "4 oz",
    "calories": 104,
    "protein": 17.2,
    "carbs": 5.3,
    "fat": 1.9,
    "fiber": 1.2,
    "sugar": 2.0,
    "sodium": 179.3,
    "allergens": [
      "gluten",
      "sesame",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100984*4-16-Lu",
    "name": "Salt and Pepper Tofu",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roma Vegan Salads and Panini",
    "servingSize": "4 oz",
    "calories": 301,
    "protein": 14.8,
    "carbs": 13.9,
    "fat": 22.4,
    "fiber": 1.3,
    "sugar": 1.6,
    "sodium": 307.6,
    "allergens": [
      "alcohol",
      "gluten",
      "sesame",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100324*1-16-Lu",
    "name": "Black Bean Chipotle Burger",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roma Vegan Salads and Panini",
    "servingSize": "1 each",
    "calories": 198,
    "protein": 10.8,
    "carbs": 24.2,
    "fat": 7.2,
    "fiber": 0.0,
    "sugar": 3.6,
    "sodium": 727.2,
    "allergens": [
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100301*3-16-Lu",
    "name": "Southwestern Lentils w/ Potato",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roma Vegan Sides",
    "servingSize": "3 oz",
    "calories": 122,
    "protein": 8.3,
    "carbs": 22.0,
    "fat": 0.6,
    "fiber": 3.8,
    "sugar": 0.1,
    "sodium": 46.0,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090372*1-16-Lu",
    "name": "Pumpkin Seeds",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roma Vegan Sides",
    "servingSize": "1 oz",
    "calories": 152,
    "protein": 8.1,
    "carbs": 3.0,
    "fat": 13.2,
    "fiber": 2.0,
    "sugar": 0.0,
    "sodium": 1.6,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150350*3-16-Lu",
    "name": "Roasted Corn",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roma Vegan Sides",
    "servingSize": "3 oz",
    "calories": 126,
    "protein": 3.7,
    "carbs": 26.4,
    "fat": 1.5,
    "fiber": 1.3,
    "sugar": 6.1,
    "sodium": 46.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090209*1-16-Lu",
    "name": "Garbanzo Beans",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roma Vegan Sides",
    "servingSize": "1 oz",
    "calories": 66,
    "protein": 3.4,
    "carbs": 11.1,
    "fat": 1.1,
    "fiber": 3.1,
    "sugar": 2.0,
    "sodium": 4.4,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150354*4-16-Lu",
    "name": "Italian Style Anasazi Beans",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roma Vegan Sides",
    "servingSize": "4 oz",
    "calories": 55,
    "protein": 3.1,
    "carbs": 8.1,
    "fat": 1.5,
    "fiber": 1.9,
    "sugar": 1.0,
    "sodium": 53.7,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090290*1-16-Lu",
    "name": "Red Beans",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Roma Vegan Sides",
    "servingSize": "1 OZ",
    "calories": 50,
    "protein": 3.0,
    "carbs": 8.0,
    "fat": 0.3,
    "fiber": 2.5,
    "sugar": 0.5,
    "sodium": 135.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220105*1-16-Lu",
    "name": "Parmesan Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 7.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 435.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090269*2-16-Lu",
    "name": "Eggs",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Salad Bar",
    "servingSize": "2 oz",
    "calories": 96,
    "protein": 8.4,
    "carbs": 1.2,
    "fat": 7.2,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 84.1,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119385*1-16-Lu",
    "name": "Greek Pita Flat Bread",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Salad Bar",
    "servingSize": "1 each",
    "calories": 247,
    "protein": 8.2,
    "carbs": 41.1,
    "fat": 6.2,
    "fiber": 2.1,
    "sugar": 2.1,
    "sodium": 442.1,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090265*1-16-Lu",
    "name": "Shredded Cheddar Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 111,
    "protein": 7.1,
    "carbs": 0.0,
    "fat": 9.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 182.3,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090263*2-16-Lu",
    "name": "Cottage Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Salad Bar",
    "servingSize": "2 oz",
    "calories": 40,
    "protein": 5.5,
    "carbs": 3.0,
    "fat": 0.5,
    "fiber": 0.0,
    "sugar": 2.0,
    "sodium": 160.6,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090404*1-16-Lu",
    "name": "Sunflower Seeds",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 172,
    "protein": 5.1,
    "carbs": 7.1,
    "fat": 14.2,
    "fiber": 11.6,
    "sugar": 1.0,
    "sodium": 0.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090339*6-16-Lu",
    "name": "Beef Chili with Beans",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Soup Du Jour",
    "servingSize": "6 oz",
    "calories": 233,
    "protein": 14.1,
    "carbs": 19.0,
    "fat": 11.3,
    "fiber": 4.9,
    "sugar": 5.6,
    "sodium": 712.4,
    "allergens": [
      "dairy",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090345*6-16-Lu",
    "name": "Vegan Southwestern 3 Bean Soup",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Soup Du Jour",
    "servingSize": "6 oz",
    "calories": 143,
    "protein": 8.3,
    "carbs": 26.6,
    "fat": 0.5,
    "fiber": 6.9,
    "sugar": 4.4,
    "sodium": 544.3,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090340*6-16-Lu",
    "name": "Chicken Tortilla Soup",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Soup Du Jour",
    "servingSize": "6 oz",
    "calories": 130,
    "protein": 5.8,
    "carbs": 20.2,
    "fat": 2.9,
    "fiber": 4.3,
    "sugar": 5.8,
    "sodium": 1008.0,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090368*6-16-Lu",
    "name": "New England Clam Chowder",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Soup Du Jour",
    "servingSize": "6 oz",
    "calories": 158,
    "protein": 4.3,
    "carbs": 21.6,
    "fat": 5.8,
    "fiber": 1.4,
    "sugar": 1.4,
    "sodium": 1137.6,
    "allergens": [
      "dairy",
      "gluten",
      "shellfish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "220090*4-16-Lu",
    "name": "Yogurt Mango Pineapple Smoothie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Treats",
    "servingSize": "4 oz",
    "calories": 60,
    "protein": 4.7,
    "carbs": 6.2,
    "fat": 0.2,
    "fiber": 0.5,
    "sugar": 8.7,
    "sodium": 15.8,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102023*2-16-Lu",
    "name": "Warm Brownie Cheesecake",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Treats",
    "servingSize": "2 oz",
    "calories": 220,
    "protein": 3.2,
    "carbs": 27.5,
    "fat": 7.0,
    "fiber": 1.1,
    "sugar": 1.7,
    "sodium": 122.2,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220097*4-16-Lu",
    "name": "Banana Coconut Spinach Smoothie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Treats",
    "servingSize": "4 oz",
    "calories": 110,
    "protein": 2.4,
    "carbs": 16.1,
    "fat": 3.2,
    "fiber": 1.1,
    "sugar": 11.7,
    "sodium": 38.9,
    "allergens": [
      "coconut",
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102022*2-16-Lu",
    "name": "Warm Brownie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Treats",
    "servingSize": "2 oz",
    "calories": 236,
    "protein": 2.1,
    "carbs": 31.3,
    "fat": 6.6,
    "fiber": 1.3,
    "sugar": 2.0,
    "sodium": 123.4,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119376*1-16-Lu",
    "name": "Chocolate Chip Cookie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Treats",
    "servingSize": "1 each",
    "calories": 188,
    "protein": 2.0,
    "carbs": 25.7,
    "fat": 8.9,
    "fiber": 0.0,
    "sugar": 15.8,
    "sodium": 257.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "202010*1-16-Lu",
    "name": "Sugar Cookie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Treats",
    "servingSize": "1 each",
    "calories": 180,
    "protein": 2.0,
    "carbs": 26.0,
    "fat": 8.0,
    "fiber": 0.0,
    "sugar": 13.0,
    "sodium": 240.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "100928*1-16-Lu",
    "name": "Vegan Chocolate Cheesecake",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Vegan Desserts",
    "servingSize": "1 each",
    "calories": 175,
    "protein": 1.5,
    "carbs": 19.8,
    "fat": 10.8,
    "fiber": 1.5,
    "sugar": 10.8,
    "sodium": 171.7,
    "allergens": [
      "coconut",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100927*1-16-Lu",
    "name": "Vegan Key Lime Cheesecake",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Vegan Desserts",
    "servingSize": "1 each",
    "calories": 179,
    "protein": 1.1,
    "carbs": 17.9,
    "fat": 11.9,
    "fiber": 1.5,
    "sugar": 8.6,
    "sodium": 1.5,
    "allergens": [
      "coconut",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100929*1-16-Lu",
    "name": "Vegan Strawberry Cheesecake",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Vegan Desserts",
    "servingSize": "1 each",
    "calories": 179,
    "protein": 1.1,
    "carbs": 17.9,
    "fat": 11.6,
    "fiber": 1.5,
    "sugar": 8.6,
    "sodium": 1.5,
    "allergens": [
      "coconut",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100926*1-16-Lu",
    "name": "Vegan Cheesecake New York",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Vegan Desserts",
    "servingSize": "1 each",
    "calories": 43,
    "protein": 0.4,
    "carbs": 4.3,
    "fat": 4.3,
    "fiber": 1.0,
    "sugar": 2.1,
    "sodium": 0.0,
    "allergens": [
      "coconut",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090328*7-16-Lu",
    "name": "Waffle",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "7 oz",
    "calories": 557,
    "protein": 11.8,
    "carbs": 70.9,
    "fat": 25.3,
    "fiber": 0.0,
    "sugar": 8.4,
    "sodium": 1285.0,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119360*1-16-Lu",
    "name": "Bagels",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "1 ea",
    "calories": 295,
    "protein": 10.0,
    "carbs": 60.5,
    "fat": 1.2,
    "fiber": 4.7,
    "sugar": 5.0,
    "sodium": 376.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "sesame",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090331*1-16-Lu",
    "name": "Plain Cream Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 9.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 96.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119364*1-16-Lu",
    "name": "Donuts",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "1 EACH",
    "calories": 138,
    "protein": 1.7,
    "carbs": 17.0,
    "fat": 7.3,
    "fiber": 0.6,
    "sugar": 2.3,
    "sodium": 131.1,
    "allergens": [
      "coconut",
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220065*1-16-Lu",
    "name": "Butter",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "1 oz",
    "calories": 202,
    "protein": 0.0,
    "carbs": 0.0,
    "fat": 22.3,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 0.0,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220066*1-16-Lu",
    "name": "Margarine",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "1 oz",
    "calories": 202,
    "protein": 0.0,
    "carbs": 0.0,
    "fat": 22.3,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 212.6,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "050400*1-16-Di",
    "name": "Lemon Oregano Chicken",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Broiler Works",
    "servingSize": "1 EACH",
    "calories": 158,
    "protein": 22.3,
    "carbs": 0.0,
    "fat": 7.4,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 526.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "126301*1-16-Di",
    "name": "Cheeseburger with American Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Broiler Works",
    "servingSize": "1 each",
    "calories": 283,
    "protein": 18.9,
    "carbs": 0.5,
    "fat": 22.8,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 445.9,
    "allergens": [
      "dairy",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "126035*1-16-Di",
    "name": "Grilled Hot Dog",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Broiler Works",
    "servingSize": "1 each",
    "calories": 168,
    "protein": 9.7,
    "carbs": 0.4,
    "fat": 14.3,
    "fiber": null,
    "sugar": null,
    "sodium": 826.2,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "090271*1-16-Di",
    "name": "Bacon Bits",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Broiler Works Sides",
    "servingSize": "1 oz",
    "calories": 127,
    "protein": 12.0,
    "carbs": 0.5,
    "fat": 8.7,
    "fiber": 0.2,
    "sugar": 0.5,
    "sodium": 603.5,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "220110*1-16-Di",
    "name": "Spicy Brown Mustard",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Broiler Works Sides",
    "servingSize": "1 oz",
    "calories": 148,
    "protein": 7.9,
    "carbs": 11.0,
    "fat": 9.1,
    "fiber": 4.6,
    "sugar": 2.1,
    "sodium": 1.6,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "119387*1-16-Di",
    "name": "Potato Hot Dog Roll",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Broiler Works Sides",
    "servingSize": "1 each",
    "calories": 140,
    "protein": 4.0,
    "carbs": 27.0,
    "fat": 1.5,
    "fiber": 1.0,
    "sugar": 4.0,
    "sodium": 250.0,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119388*1-16-Di",
    "name": "Potato Hamburger Roll",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Broiler Works Sides",
    "servingSize": "1 each",
    "calories": 123,
    "protein": 3.8,
    "carbs": 22.6,
    "fat": 1.9,
    "fiber": 0.9,
    "sugar": 1.9,
    "sodium": 198.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "141119*4-16-Di",
    "name": "Seasoned Spiral Fries",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Broiler Works Sides",
    "servingSize": "4 oz",
    "calories": 162,
    "protein": 2.1,
    "carbs": 20.3,
    "fat": 8.1,
    "fiber": 2.0,
    "sugar": 0.2,
    "sodium": 435.5,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150319*1-16-Di",
    "name": "Grilled Mushrooms",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Broiler Works Sides",
    "servingSize": "1 oz",
    "calories": 16,
    "protein": 2.0,
    "carbs": 2.0,
    "fat": 0.3,
    "fiber": 0.7,
    "sugar": 0.0,
    "sodium": 10.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090101*4-16-Di",
    "name": "Mediterranean Grilled Cod",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Table",
    "servingSize": "4 oz",
    "calories": 120,
    "protein": 20.0,
    "carbs": 5.0,
    "fat": 1.9,
    "fiber": 0.2,
    "sugar": 0.3,
    "sodium": 87.5,
    "allergens": [
      "fish",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "080250*4-16-Di",
    "name": "Moroccan Chicken with Peppers, Lemons, Olives",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Table",
    "servingSize": "4 oz",
    "calories": 78,
    "protein": 8.0,
    "carbs": 5.4,
    "fat": 2.6,
    "fiber": 0.8,
    "sugar": 2.9,
    "sodium": 108.3,
    "allergens": [
      "alcohol"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "151013*4-16-Di",
    "name": "Cannelloni Beans Farro and Cremini Mushrooms in Herb Tomato",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Table",
    "servingSize": "4 oz",
    "calories": 83,
    "protein": 3.5,
    "carbs": 14.4,
    "fat": 1.6,
    "fiber": 2.0,
    "sugar": 2.7,
    "sodium": 121.3,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150437*3-16-Di",
    "name": "Moroccan Lentils With Cilantro",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Sides",
    "servingSize": "3 OZ",
    "calories": 295,
    "protein": 13.3,
    "carbs": 37.7,
    "fat": 10.4,
    "fiber": 6.7,
    "sugar": 1.3,
    "sodium": 866.8,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "903035*4-16-Di",
    "name": "Moroccan Orzo Salad",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Sides",
    "servingSize": "4 OZ",
    "calories": 313,
    "protein": 7.9,
    "carbs": 43.4,
    "fat": 12.2,
    "fiber": 2.6,
    "sugar": 2.8,
    "sodium": 183.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "115199*4-16-Di",
    "name": "Semolina Pasta Cooked",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Sides",
    "servingSize": "4 oz",
    "calories": 142,
    "protein": 4.5,
    "carbs": 26.9,
    "fat": 2.1,
    "fiber": 1.3,
    "sugar": 1.4,
    "sodium": 1.5,
    "allergens": [
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150285*3-16-Di",
    "name": "Moroccan Spiced Corn",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Sides",
    "servingSize": "3 OZ",
    "calories": 201,
    "protein": 3.3,
    "carbs": 23.0,
    "fat": 11.4,
    "fiber": 1.4,
    "sugar": 5.3,
    "sodium": 272.6,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100306*3-16-Di",
    "name": "Tomato Garlic Barley",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Sides",
    "servingSize": "3 OZ",
    "calories": 113,
    "protein": 3.3,
    "carbs": 24.3,
    "fat": 0.8,
    "fiber": 4.6,
    "sugar": 2.1,
    "sodium": 263.7,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "145001*3-16-Di",
    "name": "White Rice",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Sides",
    "servingSize": "3 oz",
    "calories": 102,
    "protein": 2.4,
    "carbs": 22.3,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 2.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "080086*4-16-Di",
    "name": "Chargrilled Seasoned Chicken Breast",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Deli",
    "servingSize": "4 OZ",
    "calories": 150,
    "protein": 22.0,
    "carbs": 1.3,
    "fat": 5.9,
    "fiber": 0.2,
    "sugar": 0.1,
    "sodium": 104.7,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "903038*4-16-Di",
    "name": "Green Goddess Chicken Salad",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Deli",
    "servingSize": "4 OZ",
    "calories": 181,
    "protein": 20.3,
    "carbs": 3.1,
    "fat": 9.5,
    "fiber": 0.4,
    "sugar": 0.5,
    "sodium": 502.7,
    "allergens": [
      "dairy",
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "126379*3-16-Di",
    "name": "Ham Sliced",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Deli",
    "servingSize": "3 oz",
    "calories": 106,
    "protein": 13.7,
    "carbs": 4.6,
    "fat": 3.0,
    "fiber": 0.0,
    "sugar": 4.6,
    "sodium": 1002.4,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "126378*3-16-Di",
    "name": "Turkey Sliced",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Deli",
    "servingSize": "3 oz",
    "calories": 76,
    "protein": 13.7,
    "carbs": 1.5,
    "fat": 1.5,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 683.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "126380*3-16-Di",
    "name": "Tuna Salad",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Deli",
    "servingSize": "3 oz",
    "calories": 130,
    "protein": 12.6,
    "carbs": 2.3,
    "fat": 7.9,
    "fiber": 0.1,
    "sugar": 0.3,
    "sodium": 321.6,
    "allergens": [
      "eggs",
      "fish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "150295*2-16-Di",
    "name": "Crispy Chickpeas",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Deli",
    "servingSize": "2 OZ",
    "calories": 226,
    "protein": 9.5,
    "carbs": 30.7,
    "fat": 7.9,
    "fiber": 8.5,
    "sugar": 5.5,
    "sodium": 89.7,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090099*4-16-Di",
    "name": "Cuban Mojo Grilled Shrimp",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Deli+",
    "servingSize": "4 oz",
    "calories": 238,
    "protein": 17.9,
    "carbs": 1.3,
    "fat": 17.4,
    "fiber": 0.0,
    "sugar": 0.7,
    "sodium": 362.4,
    "allergens": [
      "shellfish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "145216*3-16-Di",
    "name": "Sweet Coconut Rice",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Deli+",
    "servingSize": "3 oz",
    "calories": 218,
    "protein": 3.1,
    "carbs": 22.4,
    "fat": 8.7,
    "fiber": 0.9,
    "sugar": 1.8,
    "sodium": 9.5,
    "allergens": [
      "coconut"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150349*3-16-Di",
    "name": "Spicy Black Beans",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Deli+",
    "servingSize": "3 oz",
    "calories": 47,
    "protein": 2.7,
    "carbs": 7.5,
    "fat": 0.5,
    "fiber": 2.6,
    "sugar": 0.6,
    "sodium": 136.2,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150371*2-16-Di",
    "name": "Fried Plantains",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Deli+",
    "servingSize": "2 oz",
    "calories": 102,
    "protein": 1.1,
    "carbs": 19.3,
    "fat": 2.0,
    "fiber": 1.1,
    "sugar": 13.6,
    "sodium": 14.2,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220067*1-16-Di",
    "name": "Sliced Jalapeno Peppers",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Deli+",
    "servingSize": "1 oz",
    "calories": 4,
    "protein": 0.8,
    "carbs": 0.8,
    "fat": 0.0,
    "fiber": 0.8,
    "sugar": 0.0,
    "sodium": 105.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220069*1-16-Di",
    "name": "Chopped Green Onions",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Deli+",
    "servingSize": "1 oz",
    "calories": 9,
    "protein": 0.6,
    "carbs": 2.1,
    "fat": 0.0,
    "fiber": 0.8,
    "sugar": 0.6,
    "sodium": 4.6,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220154*3-16-Di",
    "name": "Fresh Mozzarella",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Grill Works",
    "servingSize": "3 oz",
    "calories": 274,
    "protein": 23.6,
    "carbs": 3.5,
    "fat": 18.2,
    "fiber": 0.0,
    "sugar": 0.5,
    "sodium": 479.0,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117083*1-16-Di",
    "name": "Parmesan Garlic Bread",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Grill Works",
    "servingSize": "1 each",
    "calories": 174,
    "protein": 4.0,
    "carbs": 21.3,
    "fat": 8.7,
    "fiber": 0.7,
    "sugar": 0.7,
    "sodium": 232.8,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "151272*2-16-Di",
    "name": "Tomato Basil Bruschetta",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Grill Works",
    "servingSize": "2 oz",
    "calories": 42,
    "protein": 0.3,
    "carbs": 1.4,
    "fat": 4.4,
    "fiber": 0.2,
    "sugar": 0.4,
    "sodium": 138.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220106*1-16-Di",
    "name": "Balsamic Glaze",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Grill Works",
    "servingSize": "1 oz",
    "calories": 57,
    "protein": 0.0,
    "carbs": 13.2,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 13.2,
    "sodium": 9.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "080185*4-16-Di",
    "name": "Mushroom Chicken",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mongolian Grill",
    "servingSize": "4 oz",
    "calories": 90,
    "protein": 13.4,
    "carbs": 4.9,
    "fat": 1.8,
    "fiber": 0.8,
    "sugar": 1.5,
    "sodium": 306.0,
    "allergens": [
      "gluten",
      "sesame",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "115259*4-16-Di",
    "name": "Asian Garlic Noodles",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mongolian Grill",
    "servingSize": "4 oz",
    "calories": 376,
    "protein": 8.9,
    "carbs": 54.1,
    "fat": 13.6,
    "fiber": 1.5,
    "sugar": 8.9,
    "sodium": 569.3,
    "allergens": [
      "dairy",
      "gluten",
      "shellfish",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "145219*4-16-Di",
    "name": "Mushroom Jasmine Rice",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mongolian Grill",
    "servingSize": "4 oz",
    "calories": 204,
    "protein": 3.9,
    "carbs": 39.5,
    "fat": 3.7,
    "fiber": 0.8,
    "sugar": 0.9,
    "sodium": 259.9,
    "allergens": [
      "alcohol",
      "gluten",
      "sesame",
      "shellfish",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "220191*1-16-Di",
    "name": "Chow Mein Noodles",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mongolian Grill",
    "servingSize": "1 oz",
    "calories": 132,
    "protein": 3.0,
    "carbs": 18.2,
    "fat": 6.1,
    "fiber": 2.0,
    "sugar": 0.0,
    "sodium": 263.3,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100329*4-16-Di",
    "name": "Brown Rice",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mongolian Grill",
    "servingSize": "4 oz",
    "calories": 134,
    "protein": 2.7,
    "carbs": 28.3,
    "fat": 1.0,
    "fiber": 1.3,
    "sugar": 0.0,
    "sodium": 41.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220192*1-16-Di",
    "name": "Fried Wonton Strips",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mongolian Grill",
    "servingSize": "1 oz",
    "calories": 82,
    "protein": 2.7,
    "carbs": 16.8,
    "fat": 0.4,
    "fiber": 0.5,
    "sugar": 0.0,
    "sodium": 162.1,
    "allergens": [
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "080286*4-16-Di",
    "name": "Asian Chicken Mongolian Grill",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mongolian Grill Made to Ord",
    "servingSize": "4 oz",
    "calories": 125,
    "protein": 26.3,
    "carbs": 0.0,
    "fat": 1.4,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 74.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "050181*4-16-Di",
    "name": "Asian Beef Mongolian Grill",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mongolian Grill Made to Ord",
    "servingSize": "4 oz",
    "calories": 243,
    "protein": 22.7,
    "carbs": 0.0,
    "fat": 15.9,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 57.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "090173*4-16-Di",
    "name": "Asian Shrimp Mongolian Grill",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mongolian Grill Made to Ord",
    "servingSize": "4 oz",
    "calories": 84,
    "protein": 17.8,
    "carbs": 0.0,
    "fat": 0.9,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 190.5,
    "allergens": [
      "shellfish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090268*2-16-Di",
    "name": "Tofu",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mongolian Grill Made to Ord",
    "servingSize": "2 OZ",
    "calories": 81,
    "protein": 9.3,
    "carbs": 1.9,
    "fat": 4.9,
    "fiber": 0.6,
    "sugar": 0.0,
    "sodium": 3.1,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "115250*4-16-Di",
    "name": "Pad Thai Noodle Mongolian Grill",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mongolian Grill Made to Ord",
    "servingSize": "4 oz",
    "calories": 405,
    "protein": 6.1,
    "carbs": 93.2,
    "fat": 0.0,
    "fiber": 4.1,
    "sugar": 0.0,
    "sodium": 40.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "115188*4-16-Di",
    "name": "Cooked Lo Mein",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mongolian Grill Made to Ord",
    "servingSize": "4 OZ",
    "calories": 125,
    "protein": 4.8,
    "carbs": 23.7,
    "fat": 1.3,
    "fiber": 0.6,
    "sugar": 0.3,
    "sodium": 101.1,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "080179*3-16-Di",
    "name": "Diced Chicken",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Pasta",
    "servingSize": "3 oz",
    "calories": 101,
    "protein": 20.3,
    "carbs": 0.0,
    "fat": 2.5,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 567.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "050164*3-16-Di",
    "name": "Meatball no sauce",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Pasta",
    "servingSize": "3 each",
    "calories": 265,
    "protein": 18.1,
    "carbs": 8.3,
    "fat": 19.1,
    "fiber": 2.2,
    "sugar": 2.0,
    "sodium": 734.0,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "pork",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "100312*3-16-Di",
    "name": "Tofu",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Pasta",
    "servingSize": "3 oz",
    "calories": 122,
    "protein": 14.0,
    "carbs": 2.8,
    "fat": 7.3,
    "fiber": 0.9,
    "sugar": 0.0,
    "sodium": 4.7,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "902300*3-16-Di",
    "name": "Italian Sausage Balls",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Pasta",
    "servingSize": "3 oz",
    "calories": 284,
    "protein": 11.9,
    "carbs": 4.5,
    "fat": 25.4,
    "fiber": 1.5,
    "sugar": 0.0,
    "sodium": 880.3,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "115200*4-16-Di",
    "name": "Whole Wheat Pasta (Cooked)",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Pasta",
    "servingSize": "4 oz",
    "calories": 293,
    "protein": 11.7,
    "carbs": 56.9,
    "fat": 5.6,
    "fiber": 8.8,
    "sugar": 2.9,
    "sodium": 1.5,
    "allergens": [
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "135116*2-16-Di",
    "name": "Alfredo Sauce",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Pasta",
    "servingSize": "2 oz",
    "calories": 111,
    "protein": 2.3,
    "carbs": 4.1,
    "fat": 9.4,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 222.4,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117127*1-16-Di",
    "name": "Pan BBQ Chicken Pizza",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Pizza",
    "servingSize": "1 slice",
    "calories": 496,
    "protein": 26.6,
    "carbs": 48.4,
    "fat": 22.5,
    "fiber": 8.6,
    "sugar": 27.2,
    "sodium": 1545.0,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "117118*1-16-Di",
    "name": "Pan Italian Sausage Pizza",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Pizza",
    "servingSize": "1 slice",
    "calories": 471,
    "protein": 20.8,
    "carbs": 45.0,
    "fat": 23.3,
    "fiber": 8.6,
    "sugar": 25.0,
    "sodium": 1358.3,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "117117*1-16-Di",
    "name": "Pan Vegetable Pizza",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Pizza",
    "servingSize": "1 slice",
    "calories": 452,
    "protein": 20.3,
    "carbs": 45.7,
    "fat": 21.3,
    "fiber": 8.8,
    "sugar": 25.2,
    "sodium": 1284.9,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117116*1-16-Di",
    "name": "Pan Cheese Pizza",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Pizza",
    "servingSize": "1 slice",
    "calories": 449,
    "protein": 20.0,
    "carbs": 45.0,
    "fat": 21.3,
    "fiber": 8.6,
    "sugar": 25.0,
    "sodium": 1284.0,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117115*1-16-Di",
    "name": "Pan Pepperoni Pizza",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Pizza",
    "servingSize": "1 slice",
    "calories": 276,
    "protein": 18.5,
    "carbs": 14.2,
    "fat": 18.7,
    "fiber": 0.8,
    "sugar": 1.8,
    "sodium": 656.4,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "080870*4-16-Di",
    "name": "Soy Free Teriyaki Chicken",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Purple Zone",
    "servingSize": "4 oz",
    "calories": 148,
    "protein": 21.0,
    "carbs": 6.3,
    "fat": 4.3,
    "fiber": 0.0,
    "sugar": 5.2,
    "sodium": 204.8,
    "allergens": [
      "alcohol",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "060142*4-16-Di",
    "name": "Sweet & Sour Pork",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Purple Zone",
    "servingSize": "4 oz",
    "calories": 286,
    "protein": 12.7,
    "carbs": 8.4,
    "fat": 22.0,
    "fiber": 0.1,
    "sugar": 6.8,
    "sodium": 147.5,
    "allergens": [
      "alcohol",
      "pea_protein",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "101019*4-16-Di",
    "name": "Red Lentil Penne Pasta",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Purple Zone Sides",
    "servingSize": "4 oz",
    "calories": 170,
    "protein": 9.6,
    "carbs": 25.1,
    "fat": 5.3,
    "fiber": 4.4,
    "sugar": 0.7,
    "sodium": 211.3,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "145237*3-16-Di",
    "name": "Pineapple Jasmine Rice",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Purple Zone Sides",
    "servingSize": "3 oz",
    "calories": 124,
    "protein": 2.3,
    "carbs": 27.6,
    "fat": 0.3,
    "fiber": 0.5,
    "sugar": 2.1,
    "sodium": 77.9,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "019360*1-16-Di",
    "name": "Millet & Chia Burger Buns",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Purple Zone Sides",
    "servingSize": "1 EACH",
    "calories": 264,
    "protein": 1.9,
    "carbs": 34.9,
    "fat": 12.2,
    "fiber": 4.7,
    "sugar": 0.9,
    "sodium": 263.8,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151061*3-16-Di",
    "name": "Red Chili and Garlic Bok Choy",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Purple Zone Sides",
    "servingSize": "3 oz",
    "calories": 37,
    "protein": 1.1,
    "carbs": 2.3,
    "fat": 3.0,
    "fiber": 0.8,
    "sugar": 1.2,
    "sodium": 188.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "019359*2-16-Di",
    "name": "Sliced White Bread",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Purple Zone Sides",
    "servingSize": "2 EACH",
    "calories": 155,
    "protein": 0.9,
    "carbs": 32.8,
    "fat": 3.6,
    "fiber": 3.6,
    "sugar": 4.6,
    "sodium": 2.0,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151383*3-16-Di",
    "name": "Steamed Carrots",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Purple Zone Sides",
    "servingSize": "3 oz",
    "calories": 41,
    "protein": 0.8,
    "carbs": 8.4,
    "fat": 0.8,
    "fiber": 2.4,
    "sugar": 4.0,
    "sodium": 337.2,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "080051*4-16-Di",
    "name": "Old bay Chicken Pot Pie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roaster",
    "servingSize": "4 oz",
    "calories": 970,
    "protein": 34.9,
    "carbs": 151.7,
    "fat": 36.4,
    "fiber": 23.9,
    "sugar": 12.2,
    "sodium": 602.3,
    "allergens": [
      "dairy",
      "gluten",
      "peanuts",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090018*3-16-Di",
    "name": "Chesapeake mac and cheese with crab dust",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roaster Sides",
    "servingSize": "3 OZ",
    "calories": 200,
    "protein": 11.6,
    "carbs": 18.8,
    "fat": 9.6,
    "fiber": 0.5,
    "sugar": 2.0,
    "sodium": 286.4,
    "allergens": [
      "dairy",
      "gluten",
      "shellfish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "150155*3-16-Di",
    "name": "Parmesan Crusted roasted Potatoes",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roaster Sides",
    "servingSize": "3 oz",
    "calories": 183,
    "protein": 6.3,
    "carbs": 21.3,
    "fat": 8.5,
    "fiber": 2.2,
    "sugar": 1.7,
    "sodium": 245.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150154*3-16-Di",
    "name": "sweet corn hush puppies",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roaster Sides",
    "servingSize": "3 oz",
    "calories": 175,
    "protein": 5.4,
    "carbs": 37.0,
    "fat": 1.9,
    "fiber": 3.9,
    "sugar": 3.8,
    "sodium": 22.9,
    "allergens": [
      "dairy",
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150152*3-16-Di",
    "name": "Zucchini and Fresh Corn Succotash",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roaster Sides",
    "servingSize": "3 oz",
    "calories": 172,
    "protein": 5.4,
    "carbs": 25.6,
    "fat": 7.2,
    "fiber": 4.1,
    "sugar": 2.4,
    "sodium": 1924.6,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150874*3-16-Di",
    "name": "Italian Roasted Brussel Sprouts",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roaster Sides",
    "servingSize": "3 oz",
    "calories": 49,
    "protein": 3.0,
    "carbs": 8.1,
    "fat": 1.4,
    "fiber": 3.3,
    "sugar": 2.0,
    "sodium": 58.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "141110*4-16-Di",
    "name": "Chef's Fresh Mashed Potatoes",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roaster Sides",
    "servingSize": "4 oz",
    "calories": 107,
    "protein": 2.3,
    "carbs": 18.8,
    "fat": 2.2,
    "fiber": 1.4,
    "sugar": 0.2,
    "sodium": 17.0,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "100984*4-16-Di",
    "name": "Salt and Pepper Tofu",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roma Vegan Salads and Panini",
    "servingSize": "4 oz",
    "calories": 301,
    "protein": 14.8,
    "carbs": 13.9,
    "fat": 22.4,
    "fiber": 1.3,
    "sugar": 1.6,
    "sodium": 307.6,
    "allergens": [
      "alcohol",
      "gluten",
      "sesame",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100324*1-16-Di",
    "name": "Black Bean Chipotle Burger",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roma Vegan Salads and Panini",
    "servingSize": "1 each",
    "calories": 198,
    "protein": 10.8,
    "carbs": 24.2,
    "fat": 7.2,
    "fiber": 0.0,
    "sugar": 3.6,
    "sodium": 727.2,
    "allergens": [
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100936*4-16-Di",
    "name": "Spicy Chana Masala Chickpeas",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roma Vegan Salads and Panini",
    "servingSize": "4 oz",
    "calories": 145,
    "protein": 5.8,
    "carbs": 22.7,
    "fat": 4.3,
    "fiber": 4.8,
    "sugar": 4.1,
    "sodium": 140.3,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100301*3-16-Di",
    "name": "Southwestern Lentils w/ Potato",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roma Vegan Sides",
    "servingSize": "3 oz",
    "calories": 122,
    "protein": 8.3,
    "carbs": 22.0,
    "fat": 0.6,
    "fiber": 3.8,
    "sugar": 0.1,
    "sodium": 46.0,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090372*1-16-Di",
    "name": "Pumpkin Seeds",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roma Vegan Sides",
    "servingSize": "1 oz",
    "calories": 152,
    "protein": 8.1,
    "carbs": 3.0,
    "fat": 13.2,
    "fiber": 2.0,
    "sugar": 0.0,
    "sodium": 1.6,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150350*3-16-Di",
    "name": "Roasted Corn",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roma Vegan Sides",
    "servingSize": "3 oz",
    "calories": 126,
    "protein": 3.7,
    "carbs": 26.4,
    "fat": 1.5,
    "fiber": 1.3,
    "sugar": 6.1,
    "sodium": 46.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090209*1-16-Di",
    "name": "Garbanzo Beans",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roma Vegan Sides",
    "servingSize": "1 oz",
    "calories": 66,
    "protein": 3.4,
    "carbs": 11.1,
    "fat": 1.1,
    "fiber": 3.1,
    "sugar": 2.0,
    "sodium": 4.4,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150354*4-16-Di",
    "name": "Italian Style Anasazi Beans",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roma Vegan Sides",
    "servingSize": "4 oz",
    "calories": 55,
    "protein": 3.1,
    "carbs": 8.1,
    "fat": 1.5,
    "fiber": 1.9,
    "sugar": 1.0,
    "sodium": 53.7,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090290*1-16-Di",
    "name": "Red Beans",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Roma Vegan Sides",
    "servingSize": "1 OZ",
    "calories": 50,
    "protein": 3.0,
    "carbs": 8.0,
    "fat": 0.3,
    "fiber": 2.5,
    "sugar": 0.5,
    "sodium": 135.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220105*1-16-Di",
    "name": "Parmesan Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 7.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 435.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090269*2-16-Di",
    "name": "Eggs",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Salad Bar",
    "servingSize": "2 oz",
    "calories": 96,
    "protein": 8.4,
    "carbs": 1.2,
    "fat": 7.2,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 84.1,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119385*1-16-Di",
    "name": "Greek Pita Flat Bread",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Salad Bar",
    "servingSize": "1 each",
    "calories": 247,
    "protein": 8.2,
    "carbs": 41.1,
    "fat": 6.2,
    "fiber": 2.1,
    "sugar": 2.1,
    "sodium": 442.1,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090265*1-16-Di",
    "name": "Shredded Cheddar Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 111,
    "protein": 7.1,
    "carbs": 0.0,
    "fat": 9.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 182.3,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090263*2-16-Di",
    "name": "Cottage Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Salad Bar",
    "servingSize": "2 oz",
    "calories": 40,
    "protein": 5.5,
    "carbs": 3.0,
    "fat": 0.5,
    "fiber": 0.0,
    "sugar": 2.0,
    "sodium": 160.6,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090404*1-16-Di",
    "name": "Sunflower Seeds",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 172,
    "protein": 5.1,
    "carbs": 7.1,
    "fat": 14.2,
    "fiber": 11.6,
    "sugar": 1.0,
    "sodium": 0.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090339*6-16-Di",
    "name": "Beef Chili with Beans",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Soup Du Jour",
    "servingSize": "6 oz",
    "calories": 233,
    "protein": 14.1,
    "carbs": 19.0,
    "fat": 11.3,
    "fiber": 4.9,
    "sugar": 5.6,
    "sodium": 712.4,
    "allergens": [
      "dairy",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090345*6-16-Di",
    "name": "Vegan Southwestern 3 Bean Soup",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Soup Du Jour",
    "servingSize": "6 oz",
    "calories": 143,
    "protein": 8.3,
    "carbs": 26.6,
    "fat": 0.5,
    "fiber": 6.9,
    "sugar": 4.4,
    "sodium": 544.3,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090340*6-16-Di",
    "name": "Chicken Tortilla Soup",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Soup Du Jour",
    "servingSize": "6 oz",
    "calories": 130,
    "protein": 5.8,
    "carbs": 20.2,
    "fat": 2.9,
    "fiber": 4.3,
    "sugar": 5.8,
    "sodium": 1008.0,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090368*6-16-Di",
    "name": "New England Clam Chowder",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Soup Du Jour",
    "servingSize": "6 oz",
    "calories": 158,
    "protein": 4.3,
    "carbs": 21.6,
    "fat": 5.8,
    "fiber": 1.4,
    "sugar": 1.4,
    "sodium": 1137.6,
    "allergens": [
      "dairy",
      "gluten",
      "shellfish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "220090*4-16-Di",
    "name": "Yogurt Mango Pineapple Smoothie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Treats",
    "servingSize": "4 oz",
    "calories": 60,
    "protein": 4.7,
    "carbs": 6.2,
    "fat": 0.2,
    "fiber": 0.5,
    "sugar": 8.7,
    "sodium": 15.8,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102023*2-16-Di",
    "name": "Warm Brownie Cheesecake",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Treats",
    "servingSize": "2 oz",
    "calories": 220,
    "protein": 3.2,
    "carbs": 27.5,
    "fat": 7.0,
    "fiber": 1.1,
    "sugar": 1.7,
    "sodium": 122.2,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220097*4-16-Di",
    "name": "Banana Coconut Spinach Smoothie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Treats",
    "servingSize": "4 oz",
    "calories": 110,
    "protein": 2.4,
    "carbs": 16.1,
    "fat": 3.2,
    "fiber": 1.1,
    "sugar": 11.7,
    "sodium": 38.9,
    "allergens": [
      "coconut",
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102022*2-16-Di",
    "name": "Warm Brownie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Treats",
    "servingSize": "2 oz",
    "calories": 236,
    "protein": 2.1,
    "carbs": 31.3,
    "fat": 6.6,
    "fiber": 1.3,
    "sugar": 2.0,
    "sodium": 123.4,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119376*1-16-Di",
    "name": "Chocolate Chip Cookie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Treats",
    "servingSize": "1 each",
    "calories": 188,
    "protein": 2.0,
    "carbs": 25.7,
    "fat": 8.9,
    "fiber": 0.0,
    "sugar": 15.8,
    "sodium": 257.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "202010*1-16-Di",
    "name": "Sugar Cookie",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Treats",
    "servingSize": "1 each",
    "calories": 180,
    "protein": 2.0,
    "carbs": 26.0,
    "fat": 8.0,
    "fiber": 0.0,
    "sugar": 13.0,
    "sodium": 240.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "100928*1-16-Di",
    "name": "Vegan Chocolate Cheesecake",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Vegan Desserts",
    "servingSize": "1 each",
    "calories": 175,
    "protein": 1.5,
    "carbs": 19.8,
    "fat": 10.8,
    "fiber": 1.5,
    "sugar": 10.8,
    "sodium": 171.7,
    "allergens": [
      "coconut",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100927*1-16-Di",
    "name": "Vegan Key Lime Cheesecake",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Vegan Desserts",
    "servingSize": "1 each",
    "calories": 179,
    "protein": 1.1,
    "carbs": 17.9,
    "fat": 11.9,
    "fiber": 1.5,
    "sugar": 8.6,
    "sodium": 1.5,
    "allergens": [
      "coconut",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100929*1-16-Di",
    "name": "Vegan Strawberry Cheesecake",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Vegan Desserts",
    "servingSize": "1 each",
    "calories": 179,
    "protein": 1.1,
    "carbs": 17.9,
    "fat": 11.6,
    "fiber": 1.5,
    "sugar": 8.6,
    "sodium": 1.5,
    "allergens": [
      "coconut",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100926*1-16-Di",
    "name": "Vegan Cheesecake New York",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Vegan Desserts",
    "servingSize": "1 each",
    "calories": 43,
    "protein": 0.4,
    "carbs": 4.3,
    "fat": 4.3,
    "fiber": 1.0,
    "sugar": 2.1,
    "sodium": 0.0,
    "allergens": [
      "coconut",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090328*7-16-Di",
    "name": "Waffle",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "7 oz",
    "calories": 557,
    "protein": 11.8,
    "carbs": 70.9,
    "fat": 25.3,
    "fiber": 0.0,
    "sugar": 8.4,
    "sodium": 1285.0,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119360*1-16-Di",
    "name": "Bagels",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "1 ea",
    "calories": 295,
    "protein": 10.0,
    "carbs": 60.5,
    "fat": 1.2,
    "fiber": 4.7,
    "sugar": 5.0,
    "sodium": 376.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "sesame",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090331*1-16-Di",
    "name": "Plain Cream Cheese",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 9.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 96.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119364*1-16-Di",
    "name": "Donuts",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "1 EACH",
    "calories": 138,
    "protein": 1.7,
    "carbs": 17.0,
    "fat": 7.3,
    "fiber": 0.6,
    "sugar": 2.3,
    "sodium": 131.1,
    "allergens": [
      "coconut",
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220065*1-16-Di",
    "name": "Butter",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "1 oz",
    "calories": 202,
    "protein": 0.0,
    "carbs": 0.0,
    "fat": 22.3,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 0.0,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220066*1-16-Di",
    "name": "Margarine",
    "diningHall": "South Campus Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Waffle, Doughnut, Bagel Bar",
    "servingSize": "1 oz",
    "calories": 202,
    "protein": 0.0,
    "carbs": 0.0,
    "fat": 22.3,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 212.6,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "060062*2-19-Br",
    "name": "Diced Ham",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Breakfast",
    "servingSize": "2 oz",
    "calories": 71,
    "protein": 9.1,
    "carbs": 3.0,
    "fat": 2.0,
    "fiber": 0.0,
    "sugar": 3.0,
    "sodium": 668.3,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "060063*1-19-Br",
    "name": "Pork Sausage Link",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Breakfast",
    "servingSize": "1 ea",
    "calories": 189,
    "protein": 8.0,
    "carbs": 2.0,
    "fat": 16.9,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 517.3,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "060185*1-19-Br",
    "name": "Turkey Bacon Chopped",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Breakfast",
    "servingSize": "1 oz",
    "calories": 3,
    "protein": 0.4,
    "carbs": 0.1,
    "fat": 0.2,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 13.3,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "040060*4+1%2f2-19-Br",
    "name": "Scrambled Eggs",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Breakfast Sides",
    "servingSize": "4 1/2 oz",
    "calories": 216,
    "protein": 16.8,
    "carbs": 1.3,
    "fat": 15.4,
    "fiber": 0.0,
    "sugar": 1.3,
    "sodium": 181.4,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "040061*4-19-Br",
    "name": "Liquid Eggs (Omelet Station)",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Breakfast Sides",
    "servingSize": "4 oz",
    "calories": 170,
    "protein": 14.7,
    "carbs": 1.1,
    "fat": 11.3,
    "fiber": 0.0,
    "sugar": 1.1,
    "sodium": 158.8,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "040069*4-19-Br",
    "name": "Egg Whites",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Breakfast Sides",
    "servingSize": "4 oz",
    "calories": 57,
    "protein": 12.5,
    "carbs": 1.1,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 1.1,
    "sodium": 192.8,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119370*1-19-Br",
    "name": "French Toast",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Breakfast Sides",
    "servingSize": "1 ea",
    "calories": 251,
    "protein": 10.9,
    "carbs": 26.0,
    "fat": 10.5,
    "fiber": 2.0,
    "sugar": 6.8,
    "sodium": 307.7,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150942*3-19-Br",
    "name": "Mushroom, Spinach & Tomato Vegetable Hash",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Breakfast Sides",
    "servingSize": "3 oz",
    "calories": 111,
    "protein": 9.2,
    "carbs": 13.7,
    "fat": 5.0,
    "fiber": 5.2,
    "sugar": 1.7,
    "sodium": 371.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090265*1-19-Br",
    "name": "Shredded Cheddar Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Breakfast Sides",
    "servingSize": "1 oz",
    "calories": 111,
    "protein": 7.1,
    "carbs": 0.0,
    "fat": 9.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 182.3,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "040064*4+1%2f2-19-Br",
    "name": "Scrambled Eggs Tomato Pepper Jack Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Good Food GF Sides",
    "servingSize": "4 1/2 oz",
    "calories": 239,
    "protein": 18.3,
    "carbs": 1.6,
    "fat": 17.2,
    "fiber": 0.0,
    "sugar": 1.4,
    "sodium": 218.5,
    "allergens": [
      "dairy",
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "100212*1-19-Br",
    "name": "Vegan Chocolate Chip Pancake (purple)",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Good Food GF Sides",
    "servingSize": "1 each",
    "calories": 146,
    "protein": 3.0,
    "carbs": 27.1,
    "fat": 3.0,
    "fiber": 1.2,
    "sugar": 7.5,
    "sodium": 119.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "141123*3-19-Br",
    "name": "Breakfast Potatoes w/ Peppers & Onions",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Good Food GF Sides",
    "servingSize": "3 oz",
    "calories": 52,
    "protein": 1.4,
    "carbs": 11.1,
    "fat": 0.3,
    "fiber": 1.2,
    "sugar": 1.3,
    "sodium": 28.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220065*1-19-Br",
    "name": "Butter",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Good Food GF Sides",
    "servingSize": "1 oz",
    "calories": 202,
    "protein": 0.0,
    "carbs": 0.0,
    "fat": 22.3,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 0.0,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220066*1-19-Br",
    "name": "Margarine",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Good Food GF Sides",
    "servingSize": "1 oz",
    "calories": 202,
    "protein": 0.0,
    "carbs": 0.0,
    "fat": 22.3,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 212.6,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090328*7-19-Br",
    "name": "Waffle",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Maryland Bakery",
    "servingSize": "7 oz",
    "calories": 557,
    "protein": 11.8,
    "carbs": 70.9,
    "fat": 25.3,
    "fiber": 0.0,
    "sugar": 8.4,
    "sodium": 1285.0,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119360*1-19-Br",
    "name": "Bagels",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Maryland Bakery",
    "servingSize": "1 ea",
    "calories": 295,
    "protein": 10.0,
    "carbs": 60.5,
    "fat": 1.2,
    "fiber": 4.7,
    "sugar": 5.0,
    "sodium": 376.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "sesame",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090331*1-19-Br",
    "name": "Plain Cream Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Maryland Bakery",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 9.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 96.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119408*1-19-Br",
    "name": "Chocolate Chip Muffin",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Maryland Bakery",
    "servingSize": "1 each",
    "calories": 186,
    "protein": 2.5,
    "carbs": 30.9,
    "fat": 6.3,
    "fiber": 0.9,
    "sugar": 18.3,
    "sodium": 323.5,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119374*1-19-Br",
    "name": "Mini Croissant",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Maryland Bakery",
    "servingSize": "1 each",
    "calories": 123,
    "protein": 2.5,
    "carbs": 14.8,
    "fat": 5.5,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 135.5,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119407*1-19-Br",
    "name": "Blueberry Muffin",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Maryland Bakery",
    "servingSize": "1 each",
    "calories": 157,
    "protein": 2.1,
    "carbs": 27.1,
    "fat": 4.5,
    "fiber": 0.7,
    "sugar": 15.2,
    "sodium": 323.5,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090327*3-19-Br",
    "name": "Oatmeal",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Salad Bar",
    "servingSize": "3 oz",
    "calories": 340,
    "protein": 11.3,
    "carbs": 61.2,
    "fat": 6.8,
    "fiber": 9.1,
    "sugar": 2.3,
    "sodium": 3.6,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150086*2-19-Br",
    "name": "Fried Tofu",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Salad Bar",
    "servingSize": "2 oz",
    "calories": 103,
    "protein": 9.4,
    "carbs": 6.9,
    "fat": 4.9,
    "fiber": 0.7,
    "sugar": 0.0,
    "sodium": 303.2,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090319*5-19-Br",
    "name": "Special K Berry",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Salad Bar",
    "servingSize": "5 oz",
    "calories": 503,
    "protein": 9.1,
    "carbs": 123.5,
    "fat": 0.0,
    "fiber": 13.7,
    "sugar": 41.2,
    "sodium": 868.8,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "903343*4-19-Br",
    "name": "Vanilla Greek Yogurt",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Salad Bar",
    "servingSize": "4 oz",
    "calories": 86,
    "protein": 9.1,
    "carbs": 14.6,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 13.6,
    "sodium": 37.8,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090263*2-19-Br",
    "name": "Cottage Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Salad Bar",
    "servingSize": "2 oz",
    "calories": 40,
    "protein": 5.5,
    "carbs": 3.0,
    "fat": 0.5,
    "fiber": 0.0,
    "sugar": 2.0,
    "sodium": 160.6,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "145010*4-19-Br",
    "name": "Concha-Style Arroz Caldo",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Salad Bar",
    "servingSize": "4 oz",
    "calories": 77,
    "protein": 4.7,
    "carbs": 9.2,
    "fat": 2.5,
    "fiber": 0.2,
    "sugar": 0.5,
    "sodium": 159.5,
    "allergens": [
      "fish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "100395*1-19-Br",
    "name": "Chicken Breakfast Tacos",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Sprouts",
    "servingSize": "1 each",
    "calories": 193,
    "protein": 12.8,
    "carbs": 22.6,
    "fat": 6.1,
    "fiber": 2.6,
    "sugar": 1.1,
    "sodium": 451.3,
    "allergens": [
      "gluten",
      "pea_protein",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100210*4-19-Br",
    "name": "Vegan Cheddar Spinach Scrambled Eggs",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Sprouts",
    "servingSize": "4 oz",
    "calories": 170,
    "protein": 7.0,
    "carbs": 17.4,
    "fat": 9.4,
    "fiber": 2.7,
    "sugar": 2.2,
    "sodium": 625.8,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100980*1-19-Br",
    "name": "Vegan Breakfast Sausage",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Sprouts",
    "servingSize": "1 EACH",
    "calories": 70,
    "protein": 6.0,
    "carbs": 3.0,
    "fat": 3.5,
    "fiber": 1.0,
    "sugar": 0.7,
    "sodium": 2.3,
    "allergens": [
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100208*1-19-Br",
    "name": "Vegan Pancake Gluten Free",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Sprouts",
    "servingSize": "1 each",
    "calories": 128,
    "protein": 2.5,
    "carbs": 22.6,
    "fat": 3.0,
    "fiber": 0.7,
    "sugar": 3.4,
    "sodium": 119.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100213*4-19-Br",
    "name": "Vegan Vanilla Soy-Free Yogurt",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Sprouts Sides",
    "servingSize": "4 oz",
    "calories": 106,
    "protein": 4.5,
    "carbs": 15.9,
    "fat": 2.6,
    "fiber": 1.5,
    "sugar": 12.1,
    "sodium": 68.0,
    "allergens": [
      "coconut"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100389*4-19-Br",
    "name": "Roasted Sweet Potatoes with Spinach and Carrots",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Sprouts Sides",
    "servingSize": "4 oz",
    "calories": 106,
    "protein": 2.4,
    "carbs": 23.5,
    "fat": 0.6,
    "fiber": 3.9,
    "sugar": 8.1,
    "sodium": 127.2,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100224*4-19-Br",
    "name": "Vegan Cinnamon Apple Barley Pudding",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Sprouts Sides",
    "servingSize": "4 oz",
    "calories": 142,
    "protein": 1.6,
    "carbs": 24.2,
    "fat": 4.7,
    "fiber": 2.1,
    "sugar": 10.1,
    "sodium": 45.6,
    "allergens": [
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100321*1-19-Br",
    "name": "Vegan Sour Cream",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Sprouts Sides",
    "servingSize": "1 oz",
    "calories": 40,
    "protein": 1.0,
    "carbs": 3.0,
    "fat": 3.0,
    "fiber": null,
    "sugar": null,
    "sodium": 30.0,
    "allergens": [
      "coconut"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100322*1-19-Br",
    "name": "Vegan Cream Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Sprouts Sides",
    "servingSize": "1 oz",
    "calories": 76,
    "protein": 0.0,
    "carbs": 3.8,
    "fat": 6.6,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 113.4,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "040065*4+1%2f2-19-Br",
    "name": "Scrambled Cheesy Cheddar Egg",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Breakfast",
    "station": "Terp Comfort Sides",
    "servingSize": "4 1/2 oz",
    "calories": 241,
    "protein": 18.5,
    "carbs": 1.3,
    "fat": 17.5,
    "fiber": 0.0,
    "sugar": 1.3,
    "sodium": 223.1,
    "allergens": [
      "dairy",
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "115199*4-19-Lu",
    "name": "Semolina Pasta Cooked",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Al Forno Pastas",
    "servingSize": "4 oz",
    "calories": 142,
    "protein": 4.5,
    "carbs": 26.9,
    "fat": 2.1,
    "fiber": 1.3,
    "sugar": 1.4,
    "sodium": 1.5,
    "allergens": [
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "135116*2-19-Lu",
    "name": "Alfredo Sauce",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Al Forno Pastas",
    "servingSize": "2 oz",
    "calories": 111,
    "protein": 2.3,
    "carbs": 4.1,
    "fat": 9.4,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 222.4,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "135002*1-19-Lu",
    "name": "Roasted Garlic Basil Marinara Sauce",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Al Forno Pastas",
    "servingSize": "1 oz",
    "calories": 18,
    "protein": 0.5,
    "carbs": 2.0,
    "fat": 0.8,
    "fiber": 0.5,
    "sugar": 1.5,
    "sodium": 61.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "060062*2-19-Lu",
    "name": "Diced Ham",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Breakfast",
    "servingSize": "2 oz",
    "calories": 71,
    "protein": 9.1,
    "carbs": 3.0,
    "fat": 2.0,
    "fiber": 0.0,
    "sugar": 3.0,
    "sodium": 668.3,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "060063*1-19-Lu",
    "name": "Pork Sausage Link",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Breakfast",
    "servingSize": "1 ea",
    "calories": 189,
    "protein": 8.0,
    "carbs": 2.0,
    "fat": 16.9,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 517.3,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "060185*1-19-Lu",
    "name": "Turkey Bacon Chopped",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Breakfast",
    "servingSize": "1 oz",
    "calories": 3,
    "protein": 0.4,
    "carbs": 0.1,
    "fat": 0.2,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 13.3,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "040064*4+1%2f2-19-Lu",
    "name": "Scrambled Eggs Tomato Pepper Jack Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Breakfast Sides",
    "servingSize": "4 1/2 oz",
    "calories": 239,
    "protein": 18.3,
    "carbs": 1.6,
    "fat": 17.2,
    "fiber": 0.0,
    "sugar": 1.4,
    "sodium": 218.5,
    "allergens": [
      "dairy",
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "040060*4+1%2f2-19-Lu",
    "name": "Scrambled Eggs",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Breakfast Sides",
    "servingSize": "4 1/2 oz",
    "calories": 216,
    "protein": 16.8,
    "carbs": 1.3,
    "fat": 15.4,
    "fiber": 0.0,
    "sugar": 1.3,
    "sodium": 181.4,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "040061*4-19-Lu",
    "name": "Liquid Eggs (Omelet Station)",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Breakfast Sides",
    "servingSize": "4 oz",
    "calories": 170,
    "protein": 14.7,
    "carbs": 1.1,
    "fat": 11.3,
    "fiber": 0.0,
    "sugar": 1.1,
    "sodium": 158.8,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "040069*4-19-Lu",
    "name": "Egg Whites",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Breakfast Sides",
    "servingSize": "4 oz",
    "calories": 57,
    "protein": 12.5,
    "carbs": 1.1,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 1.1,
    "sodium": 192.8,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "040067*4-19-Lu",
    "name": "Scrambled Egg Whites",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Breakfast Sides",
    "servingSize": "4 oz",
    "calories": 72,
    "protein": 12.5,
    "carbs": 1.1,
    "fat": 1.8,
    "fiber": 0.0,
    "sugar": 1.1,
    "sodium": 192.8,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119370*1-19-Lu",
    "name": "French Toast",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Breakfast Sides",
    "servingSize": "1 ea",
    "calories": 251,
    "protein": 10.9,
    "carbs": 26.0,
    "fat": 10.5,
    "fiber": 2.0,
    "sugar": 6.8,
    "sodium": 307.7,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "141117*2-19-Lu",
    "name": "Tortilla Chip",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Corner Sides",
    "servingSize": "2 oz",
    "calories": 162,
    "protein": 4.1,
    "carbs": 32.4,
    "fat": 2.0,
    "fiber": 2.0,
    "sugar": 0.0,
    "sodium": 70.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "135257*2-19-Lu",
    "name": "Queso Blanco",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Corner Sides",
    "servingSize": "2 oz",
    "calories": 76,
    "protein": 3.8,
    "carbs": 1.9,
    "fat": 5.7,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 340.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "019404*1-19-Lu",
    "name": "Crisp Cinnamon Tortillas",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Corner Sides",
    "servingSize": "1 ea",
    "calories": 108,
    "protein": 3.0,
    "carbs": 19.8,
    "fat": 2.0,
    "fiber": 1.0,
    "sugar": 4.7,
    "sodium": 220.0,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "019407*1-19-Lu",
    "name": "Fresh Tortillas",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Corner Sides",
    "servingSize": "1 each",
    "calories": 109,
    "protein": 3.0,
    "carbs": 17.8,
    "fat": 3.0,
    "fiber": 1.0,
    "sugar": 0.0,
    "sodium": 237.3,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "019405*1-19-Lu",
    "name": "Corn Tostada",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Chef's Corner Sides",
    "servingSize": "1 ea",
    "calories": 77,
    "protein": 1.8,
    "carbs": 12.5,
    "fat": 2.2,
    "fiber": 0.4,
    "sugar": 0.0,
    "sodium": 146.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220084*1-19-Lu",
    "name": "Provolone Cheese Sliced",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Good Food GF Sides",
    "servingSize": "1 each",
    "calories": 76,
    "protein": 5.3,
    "carbs": 0.0,
    "fat": 6.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 182.3,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "019410*1-19-Lu",
    "name": "Northern Bakehouse Burger Bun",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Good Food GF Sides",
    "servingSize": "1 each",
    "calories": 88,
    "protein": 0.6,
    "carbs": 11.6,
    "fat": 4.1,
    "fiber": 1.6,
    "sugar": 0.3,
    "sodium": 87.9,
    "allergens": [
      "eggs",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090370*2-19-Lu",
    "name": "Sliced Roma Tomatoes",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Good Food GF Sides",
    "servingSize": "2 oz",
    "calories": 5,
    "protein": 0.3,
    "carbs": 1.1,
    "fat": 0.0,
    "fiber": 0.3,
    "sugar": 0.8,
    "sodium": 1.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126378*3-19-Lu",
    "name": "Turkey Sliced",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Joe's Grill Sides",
    "servingSize": "3 oz",
    "calories": 76,
    "protein": 13.7,
    "carbs": 1.5,
    "fat": 1.5,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 683.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "151201*4-19-Lu",
    "name": "Pesto Pasta Salad with Sundried Tomatoes",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Joe's Grill Sides",
    "servingSize": "4 oz",
    "calories": 190,
    "protein": 8.7,
    "carbs": 26.4,
    "fat": 6.4,
    "fiber": 2.5,
    "sugar": 5.8,
    "sodium": 375.9,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "019411*2-19-Lu",
    "name": "Pullman Wheat Bread Sliced",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Joe's Grill Sides",
    "servingSize": "2 slices",
    "calories": 127,
    "protein": 6.3,
    "carbs": 24.5,
    "fat": 1.4,
    "fiber": 3.6,
    "sugar": 2.7,
    "sodium": 244.5,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220082*1-19-Lu",
    "name": "American Cheese Sliced",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Joe's Grill Sides",
    "servingSize": "1 each",
    "calories": 56,
    "protein": 3.0,
    "carbs": 0.5,
    "fat": 4.6,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 182.3,
    "allergens": [
      "dairy",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "151295*3-19-Lu",
    "name": "Potato Salad",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Joe's Grill Sides",
    "servingSize": "3 oz",
    "calories": 148,
    "protein": 2.2,
    "carbs": 20.5,
    "fat": 6.4,
    "fiber": 2.1,
    "sugar": 1.5,
    "sodium": 176.6,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150313*1%2f4-19-Lu",
    "name": "Leaf Lettuce",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Joe's Grill Sides",
    "servingSize": "1/4 oz",
    "calories": 17,
    "protein": 1.6,
    "carbs": 3.2,
    "fat": 0.2,
    "fiber": 1.5,
    "sugar": 0.9,
    "sodium": 31.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090328*7-19-Lu",
    "name": "Waffle",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Maryland Bakery",
    "servingSize": "7 oz",
    "calories": 557,
    "protein": 11.8,
    "carbs": 70.9,
    "fat": 25.3,
    "fiber": 0.0,
    "sugar": 8.4,
    "sodium": 1285.0,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119360*1-19-Lu",
    "name": "Bagels",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Maryland Bakery",
    "servingSize": "1 ea",
    "calories": 295,
    "protein": 10.0,
    "carbs": 60.5,
    "fat": 1.2,
    "fiber": 4.7,
    "sugar": 5.0,
    "sodium": 376.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "sesame",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090331*1-19-Lu",
    "name": "Plain Cream Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Maryland Bakery",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 9.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 96.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090320*5-19-Lu",
    "name": "Cereal Total Raisin Bran",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Maryland Bakery",
    "servingSize": "5 oz",
    "calories": 292,
    "protein": 7.7,
    "carbs": 70.7,
    "fat": 1.5,
    "fiber": 10.8,
    "sugar": 27.7,
    "sodium": 322.9,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090313*5-19-Lu",
    "name": "Cereal Honey Nut Cheerios",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Maryland Bakery",
    "servingSize": "5 oz",
    "calories": 356,
    "protein": 6.5,
    "carbs": 71.3,
    "fat": 4.9,
    "fiber": 6.5,
    "sugar": 29.2,
    "sodium": 518.4,
    "allergens": [
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090316*5-19-Lu",
    "name": "Cereal Reeses Puffs",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Maryland Bakery",
    "servingSize": "5 oz",
    "calories": 386,
    "protein": 5.4,
    "carbs": 70.8,
    "fat": 8.8,
    "fiber": 0.0,
    "sugar": 35.1,
    "sodium": 503.5,
    "allergens": [
      "gluten",
      "peanuts",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "117099*1-19-Lu",
    "name": "Cheese Pizza",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mezza",
    "servingSize": "1 slice",
    "calories": 167,
    "protein": 13.7,
    "carbs": 9.4,
    "fat": 10.0,
    "fiber": 0.7,
    "sugar": 1.4,
    "sodium": 341.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117100*1-19-Lu",
    "name": "Pepperoni Pizza",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mezza",
    "servingSize": "1 slice",
    "calories": 142,
    "protein": 10.2,
    "carbs": 8.2,
    "fat": 8.7,
    "fiber": 0.5,
    "sugar": 0.9,
    "sodium": 307.0,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "151202*4-19-Lu",
    "name": "Tomato Fresh Mozzarella Salad",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mezza Sides",
    "servingSize": "4 oz",
    "calories": 116,
    "protein": 6.5,
    "carbs": 4.4,
    "fat": 8.3,
    "fiber": 1.1,
    "sugar": 2.4,
    "sodium": 120.6,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117081*1-19-Lu",
    "name": "Cheddar Garlic Cheesy Bread",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mezza Sides",
    "servingSize": "1 each",
    "calories": 180,
    "protein": 6.0,
    "carbs": 15.8,
    "fat": 10.6,
    "fiber": 0.5,
    "sugar": 0.5,
    "sodium": 238.5,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119405*1-19-Lu",
    "name": "Cheddar Garlic Cheesy Bread",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mezza Sides",
    "servingSize": "1 each",
    "calories": 100,
    "protein": 4.6,
    "carbs": 5.7,
    "fat": 6.3,
    "fiber": 0.4,
    "sugar": 0.0,
    "sodium": 140.9,
    "allergens": [
      "dairy",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "151200*2-19-Lu",
    "name": "Kale Caesar Salad",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mezza Sides",
    "servingSize": "2 oz",
    "calories": 77,
    "protein": 2.3,
    "carbs": 6.4,
    "fat": 5.5,
    "fiber": 0.8,
    "sugar": 0.0,
    "sodium": 171.5,
    "allergens": [
      "dairy",
      "eggs",
      "fish",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "119402*1-19-Lu",
    "name": "Fresh Grilled Garlic Bread",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mezza Sides",
    "servingSize": "1 each",
    "calories": 71,
    "protein": 1.9,
    "carbs": 9.1,
    "fat": 2.9,
    "fiber": 0.6,
    "sugar": 0.0,
    "sodium": 88.3,
    "allergens": [
      "dairy",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220178*4-19-Lu",
    "name": "Mixed Fruit with Mint",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Mezza Sides",
    "servingSize": "4 oz",
    "calories": 59,
    "protein": 0.6,
    "carbs": 15.3,
    "fat": 0.0,
    "fiber": 1.0,
    "sugar": 14.0,
    "sodium": 9.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126391*1-19-Lu",
    "name": "American Grilled Cheese Sandwich",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Salad Bar",
    "servingSize": "1 each",
    "calories": 328,
    "protein": 12.5,
    "carbs": 41.5,
    "fat": 11.7,
    "fiber": 2.1,
    "sugar": 2.1,
    "sodium": 811.9,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090271*1-19-Lu",
    "name": "Bacon Bits",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 127,
    "protein": 12.0,
    "carbs": 0.5,
    "fat": 8.7,
    "fiber": 0.2,
    "sugar": 0.5,
    "sodium": 603.5,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090394*1-19-Lu",
    "name": "Grated Parmesan Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 113,
    "protein": 11.3,
    "carbs": 0.0,
    "fat": 11.3,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 396.9,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090268*2-19-Lu",
    "name": "Tofu",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Salad Bar",
    "servingSize": "2 OZ",
    "calories": 81,
    "protein": 9.3,
    "carbs": 1.9,
    "fat": 4.9,
    "fiber": 0.6,
    "sugar": 0.0,
    "sodium": 3.1,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220105*1-19-Lu",
    "name": "Parmesan Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 7.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 435.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090269*2-19-Lu",
    "name": "Eggs",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Salad Bar",
    "servingSize": "2 oz",
    "calories": 96,
    "protein": 8.4,
    "carbs": 1.2,
    "fat": 7.2,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 84.1,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "100329*4-19-Lu",
    "name": "Brown Rice",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Sprouts Sides",
    "servingSize": "4 oz",
    "calories": 134,
    "protein": 2.7,
    "carbs": 28.3,
    "fat": 1.0,
    "fiber": 1.3,
    "sugar": 0.0,
    "sodium": 41.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "145126*3-19-Lu",
    "name": "Sticky Rice",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Sprouts Sides",
    "servingSize": "3 oz",
    "calories": 113,
    "protein": 2.1,
    "carbs": 24.8,
    "fat": 0.2,
    "fiber": 0.4,
    "sugar": 0.0,
    "sodium": 1.6,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "115258*4-19-Lu",
    "name": "Five Cheese Macaroni Bake",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Terp Comfort Sides",
    "servingSize": "4 oz",
    "calories": 394,
    "protein": 17.3,
    "carbs": 46.3,
    "fat": 16.3,
    "fiber": 2.3,
    "sugar": 3.8,
    "sodium": 465.5,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "151215*1-19-Lu",
    "name": "Grilled Naan",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Terp Comfort Sides",
    "servingSize": "1 each",
    "calories": 351,
    "protein": 12.3,
    "carbs": 61.5,
    "fat": 7.0,
    "fiber": 7.0,
    "sugar": 3.5,
    "sodium": 579.8,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "sesame",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150304*4-19-Lu",
    "name": "Collard Green with Smoked Turkey",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Terp Comfort Sides",
    "servingSize": "4 oz",
    "calories": 67,
    "protein": 7.6,
    "carbs": 10.3,
    "fat": 0.2,
    "fiber": 2.6,
    "sugar": 2.1,
    "sodium": 60.7,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "220137*1-19-Lu",
    "name": "Cotija Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Terp Comfort Sides",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 6.1,
    "carbs": 0.0,
    "fat": 8.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 435.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "145214*3-19-Lu",
    "name": "Rice Kheer",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Terp Comfort Sides",
    "servingSize": "3 oz",
    "calories": 89,
    "protein": 3.8,
    "carbs": 11.2,
    "fat": 3.4,
    "fiber": 0.1,
    "sugar": 4.9,
    "sodium": 46.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "019403*2-19-Lu",
    "name": "Cornbread",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Terp Comfort Sides",
    "servingSize": "2 oz",
    "calories": 235,
    "protein": 2.9,
    "carbs": 29.3,
    "fat": 10.8,
    "fiber": 1.0,
    "sugar": 14.7,
    "sodium": 146.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "080286*4-19-Lu",
    "name": "Asian Chicken Mongolian Grill",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Woks",
    "servingSize": "4 oz",
    "calories": 125,
    "protein": 26.3,
    "carbs": 0.0,
    "fat": 1.4,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 74.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "050181*4-19-Lu",
    "name": "Asian Beef Mongolian Grill",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Woks",
    "servingSize": "4 oz",
    "calories": 243,
    "protein": 22.7,
    "carbs": 0.0,
    "fat": 15.9,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 57.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "903382*4-19-Lu",
    "name": "Japanese Egg Salad",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Woks",
    "servingSize": "4 oz",
    "calories": 78,
    "protein": 3.7,
    "carbs": 1.7,
    "fat": 6.6,
    "fiber": 0.1,
    "sugar": 0.6,
    "sodium": 183.7,
    "allergens": [
      "eggs",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "115188*3-19-Lu",
    "name": "Cooked Lo Mein",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Woks",
    "servingSize": "3 OZ",
    "calories": 94,
    "protein": 3.6,
    "carbs": 17.8,
    "fat": 1.0,
    "fiber": 0.5,
    "sugar": 0.2,
    "sodium": 75.8,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100409*1-19-Lu",
    "name": "Egg Roll w/ Sweet and Sour Sauce",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Woks",
    "servingSize": "1 each",
    "calories": 199,
    "protein": 3.0,
    "carbs": 33.9,
    "fat": 5.3,
    "fiber": 2.0,
    "sugar": 15.4,
    "sodium": 657.3,
    "allergens": [
      "eggs",
      "gluten",
      "sesame",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "903348*1-19-Lu",
    "name": "Chopped Ginger",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Lunch",
    "station": "Woks",
    "servingSize": "1 oz",
    "calories": 98,
    "protein": 2.6,
    "carbs": 20.1,
    "fat": 1.7,
    "fiber": 3.7,
    "sugar": 0.9,
    "sodium": 9.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "115199*4-19-Di",
    "name": "Semolina Pasta Cooked",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Al Forno Pastas",
    "servingSize": "4 oz",
    "calories": 142,
    "protein": 4.5,
    "carbs": 26.9,
    "fat": 2.1,
    "fiber": 1.3,
    "sugar": 1.4,
    "sodium": 1.5,
    "allergens": [
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "135116*2-19-Di",
    "name": "Alfredo Sauce",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Al Forno Pastas",
    "servingSize": "2 oz",
    "calories": 111,
    "protein": 2.3,
    "carbs": 4.1,
    "fat": 9.4,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 222.4,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "135002*1-19-Di",
    "name": "Roasted Garlic Basil Marinara Sauce",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Al Forno Pastas",
    "servingSize": "1 oz",
    "calories": 18,
    "protein": 0.5,
    "carbs": 2.0,
    "fat": 0.8,
    "fiber": 0.5,
    "sugar": 1.5,
    "sodium": 61.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126386*1-19-Di",
    "name": "Cheese Quesadilla",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Breakfast Sides",
    "servingSize": "1 each",
    "calories": 667,
    "protein": 30.3,
    "carbs": 55.5,
    "fat": 37.6,
    "fiber": 5.0,
    "sugar": 1.0,
    "sodium": 1223.2,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "903377*4-19-Di",
    "name": "Chili Lime Corn and Hominy Salad with Cotija Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Breakfast Sides",
    "servingSize": "4 oz",
    "calories": 193,
    "protein": 9.2,
    "carbs": 14.6,
    "fat": 11.3,
    "fiber": 1.3,
    "sugar": 3.4,
    "sodium": 366.7,
    "allergens": [
      "dairy",
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "141117*2-19-Di",
    "name": "Tortilla Chip",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Breakfast Sides",
    "servingSize": "2 oz",
    "calories": 162,
    "protein": 4.1,
    "carbs": 32.4,
    "fat": 2.0,
    "fiber": 2.0,
    "sugar": 0.0,
    "sodium": 70.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220050*1-19-Di",
    "name": "Sour Cream",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Breakfast Sides",
    "servingSize": "1 oz",
    "calories": 57,
    "protein": 0.9,
    "carbs": 18.9,
    "fat": 4.7,
    "fiber": 0.0,
    "sugar": 0.9,
    "sodium": 28.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220067*1-19-Di",
    "name": "Sliced Jalapeno Peppers",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Breakfast Sides",
    "servingSize": "1 oz",
    "calories": 4,
    "protein": 0.8,
    "carbs": 0.8,
    "fat": 0.0,
    "fiber": 0.8,
    "sugar": 0.0,
    "sodium": 105.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "135233*4-19-Di",
    "name": "Chili Con Queso",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Breakfast Sides",
    "servingSize": "4 oz",
    "calories": 24,
    "protein": 0.3,
    "carbs": 2.2,
    "fat": 1.5,
    "fiber": 0.0,
    "sugar": 0.1,
    "sodium": 124.0,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "135257*2-19-Di",
    "name": "Queso Blanco",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Corner Sides",
    "servingSize": "2 oz",
    "calories": 76,
    "protein": 3.8,
    "carbs": 1.9,
    "fat": 5.7,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 340.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "019404*1-19-Di",
    "name": "Crisp Cinnamon Tortillas",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Corner Sides",
    "servingSize": "1 ea",
    "calories": 108,
    "protein": 3.0,
    "carbs": 19.8,
    "fat": 2.0,
    "fiber": 1.0,
    "sugar": 4.7,
    "sodium": 220.0,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "019407*1-19-Di",
    "name": "Fresh Tortillas",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Corner Sides",
    "servingSize": "1 each",
    "calories": 109,
    "protein": 3.0,
    "carbs": 17.8,
    "fat": 3.0,
    "fiber": 1.0,
    "sugar": 0.0,
    "sodium": 237.3,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "019405*1-19-Di",
    "name": "Corn Tostada",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Chef's Corner Sides",
    "servingSize": "1 ea",
    "calories": 77,
    "protein": 1.8,
    "carbs": 12.5,
    "fat": 2.2,
    "fiber": 0.4,
    "sugar": 0.0,
    "sodium": 146.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220084*1-19-Di",
    "name": "Provolone Cheese Sliced",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Good Food GF Sides",
    "servingSize": "1 each",
    "calories": 76,
    "protein": 5.3,
    "carbs": 0.0,
    "fat": 6.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 182.3,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "019410*1-19-Di",
    "name": "Northern Bakehouse Burger Bun",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Good Food GF Sides",
    "servingSize": "1 each",
    "calories": 88,
    "protein": 0.6,
    "carbs": 11.6,
    "fat": 4.1,
    "fiber": 1.6,
    "sugar": 0.3,
    "sodium": 87.9,
    "allergens": [
      "eggs",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090370*2-19-Di",
    "name": "Sliced Roma Tomatoes",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Good Food GF Sides",
    "servingSize": "2 oz",
    "calories": 5,
    "protein": 0.3,
    "carbs": 1.1,
    "fat": 0.0,
    "fiber": 0.3,
    "sugar": 0.8,
    "sodium": 1.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126378*3-19-Di",
    "name": "Turkey Sliced",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Joe's Grill Sides",
    "servingSize": "3 oz",
    "calories": 76,
    "protein": 13.7,
    "carbs": 1.5,
    "fat": 1.5,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 683.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "151201*4-19-Di",
    "name": "Pesto Pasta Salad with Sundried Tomatoes",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Joe's Grill Sides",
    "servingSize": "4 oz",
    "calories": 190,
    "protein": 8.7,
    "carbs": 26.4,
    "fat": 6.4,
    "fiber": 2.5,
    "sugar": 5.8,
    "sodium": 375.9,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "019411*2-19-Di",
    "name": "Pullman Wheat Bread Sliced",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Joe's Grill Sides",
    "servingSize": "2 slices",
    "calories": 127,
    "protein": 6.3,
    "carbs": 24.5,
    "fat": 1.4,
    "fiber": 3.6,
    "sugar": 2.7,
    "sodium": 244.5,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220082*1-19-Di",
    "name": "American Cheese Sliced",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Joe's Grill Sides",
    "servingSize": "1 each",
    "calories": 56,
    "protein": 3.0,
    "carbs": 0.5,
    "fat": 4.6,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 182.3,
    "allergens": [
      "dairy",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "151295*3-19-Di",
    "name": "Potato Salad",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Joe's Grill Sides",
    "servingSize": "3 oz",
    "calories": 148,
    "protein": 2.2,
    "carbs": 20.5,
    "fat": 6.4,
    "fiber": 2.1,
    "sugar": 1.5,
    "sodium": 176.6,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150313*1%2f4-19-Di",
    "name": "Leaf Lettuce",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Joe's Grill Sides",
    "servingSize": "1/4 oz",
    "calories": 17,
    "protein": 1.6,
    "carbs": 3.2,
    "fat": 0.2,
    "fiber": 1.5,
    "sugar": 0.9,
    "sodium": 31.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090328*7-19-Di",
    "name": "Waffle",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Maryland Bakery",
    "servingSize": "7 oz",
    "calories": 557,
    "protein": 11.8,
    "carbs": 70.9,
    "fat": 25.3,
    "fiber": 0.0,
    "sugar": 8.4,
    "sodium": 1285.0,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119360*1-19-Di",
    "name": "Bagels",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Maryland Bakery",
    "servingSize": "1 ea",
    "calories": 295,
    "protein": 10.0,
    "carbs": 60.5,
    "fat": 1.2,
    "fiber": 4.7,
    "sugar": 5.0,
    "sodium": 376.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "sesame",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090331*1-19-Di",
    "name": "Plain Cream Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Maryland Bakery",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 9.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 96.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090320*5-19-Di",
    "name": "Cereal Total Raisin Bran",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Maryland Bakery",
    "servingSize": "5 oz",
    "calories": 292,
    "protein": 7.7,
    "carbs": 70.7,
    "fat": 1.5,
    "fiber": 10.8,
    "sugar": 27.7,
    "sodium": 322.9,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090313*5-19-Di",
    "name": "Cereal Honey Nut Cheerios",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Maryland Bakery",
    "servingSize": "5 oz",
    "calories": 356,
    "protein": 6.5,
    "carbs": 71.3,
    "fat": 4.9,
    "fiber": 6.5,
    "sugar": 29.2,
    "sodium": 518.4,
    "allergens": [
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090316*5-19-Di",
    "name": "Cereal Reeses Puffs",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Maryland Bakery",
    "servingSize": "5 oz",
    "calories": 386,
    "protein": 5.4,
    "carbs": 70.8,
    "fat": 8.8,
    "fiber": 0.0,
    "sugar": 35.1,
    "sodium": 503.5,
    "allergens": [
      "gluten",
      "peanuts",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "117099*1-19-Di",
    "name": "Cheese Pizza",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mezza",
    "servingSize": "1 slice",
    "calories": 167,
    "protein": 13.7,
    "carbs": 9.4,
    "fat": 10.0,
    "fiber": 0.7,
    "sugar": 1.4,
    "sodium": 341.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117100*1-19-Di",
    "name": "Pepperoni Pizza",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mezza",
    "servingSize": "1 slice",
    "calories": 142,
    "protein": 10.2,
    "carbs": 8.2,
    "fat": 8.7,
    "fiber": 0.5,
    "sugar": 0.9,
    "sodium": 307.0,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "151202*4-19-Di",
    "name": "Tomato Fresh Mozzarella Salad",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mezza Sides",
    "servingSize": "4 oz",
    "calories": 116,
    "protein": 6.5,
    "carbs": 4.4,
    "fat": 8.3,
    "fiber": 1.1,
    "sugar": 2.4,
    "sodium": 120.6,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117081*1-19-Di",
    "name": "Cheddar Garlic Cheesy Bread",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mezza Sides",
    "servingSize": "1 each",
    "calories": 180,
    "protein": 6.0,
    "carbs": 15.8,
    "fat": 10.6,
    "fiber": 0.5,
    "sugar": 0.5,
    "sodium": 238.5,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119405*1-19-Di",
    "name": "Cheddar Garlic Cheesy Bread",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mezza Sides",
    "servingSize": "1 each",
    "calories": 100,
    "protein": 4.6,
    "carbs": 5.7,
    "fat": 6.3,
    "fiber": 0.4,
    "sugar": 0.0,
    "sodium": 140.9,
    "allergens": [
      "dairy",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "151200*2-19-Di",
    "name": "Kale Caesar Salad",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mezza Sides",
    "servingSize": "2 oz",
    "calories": 77,
    "protein": 2.3,
    "carbs": 6.4,
    "fat": 5.5,
    "fiber": 0.8,
    "sugar": 0.0,
    "sodium": 171.5,
    "allergens": [
      "dairy",
      "eggs",
      "fish",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "119402*1-19-Di",
    "name": "Fresh Grilled Garlic Bread",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mezza Sides",
    "servingSize": "1 each",
    "calories": 71,
    "protein": 1.9,
    "carbs": 9.1,
    "fat": 2.9,
    "fiber": 0.6,
    "sugar": 0.0,
    "sodium": 88.3,
    "allergens": [
      "dairy",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220178*4-19-Di",
    "name": "Mixed Fruit with Mint",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Mezza Sides",
    "servingSize": "4 oz",
    "calories": 59,
    "protein": 0.6,
    "carbs": 15.3,
    "fat": 0.0,
    "fiber": 1.0,
    "sugar": 14.0,
    "sodium": 9.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126391*1-19-Di",
    "name": "American Grilled Cheese Sandwich",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Salad Bar",
    "servingSize": "1 each",
    "calories": 328,
    "protein": 12.5,
    "carbs": 41.5,
    "fat": 11.7,
    "fiber": 2.1,
    "sugar": 2.1,
    "sodium": 811.9,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090271*1-19-Di",
    "name": "Bacon Bits",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 127,
    "protein": 12.0,
    "carbs": 0.5,
    "fat": 8.7,
    "fiber": 0.2,
    "sugar": 0.5,
    "sodium": 603.5,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090394*1-19-Di",
    "name": "Grated Parmesan Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 113,
    "protein": 11.3,
    "carbs": 0.0,
    "fat": 11.3,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 396.9,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090268*2-19-Di",
    "name": "Tofu",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Salad Bar",
    "servingSize": "2 OZ",
    "calories": 81,
    "protein": 9.3,
    "carbs": 1.9,
    "fat": 4.9,
    "fiber": 0.6,
    "sugar": 0.0,
    "sodium": 3.1,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "060062*2-19-Di",
    "name": "Diced Ham",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Salad Bar",
    "servingSize": "2 oz",
    "calories": 71,
    "protein": 9.1,
    "carbs": 3.0,
    "fat": 2.0,
    "fiber": 0.0,
    "sugar": 3.0,
    "sodium": 668.3,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "220105*1-19-Di",
    "name": "Parmesan Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Salad Bar",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 7.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 435.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "100329*4-19-Di",
    "name": "Brown Rice",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Sprouts Sides",
    "servingSize": "4 oz",
    "calories": 134,
    "protein": 2.7,
    "carbs": 28.3,
    "fat": 1.0,
    "fiber": 1.3,
    "sugar": 0.0,
    "sodium": 41.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "145126*3-19-Di",
    "name": "Sticky Rice",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Sprouts Sides",
    "servingSize": "3 oz",
    "calories": 113,
    "protein": 2.1,
    "carbs": 24.8,
    "fat": 0.2,
    "fiber": 0.4,
    "sugar": 0.0,
    "sodium": 1.6,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "115258*4-19-Di",
    "name": "Five Cheese Macaroni Bake",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Terp Comfort Sides",
    "servingSize": "4 oz",
    "calories": 394,
    "protein": 17.3,
    "carbs": 46.3,
    "fat": 16.3,
    "fiber": 2.3,
    "sugar": 3.8,
    "sodium": 465.5,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "151215*1-19-Di",
    "name": "Grilled Naan",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Terp Comfort Sides",
    "servingSize": "1 each",
    "calories": 351,
    "protein": 12.3,
    "carbs": 61.5,
    "fat": 7.0,
    "fiber": 7.0,
    "sugar": 3.5,
    "sodium": 579.8,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "sesame",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150304*4-19-Di",
    "name": "Collard Green with Smoked Turkey",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Terp Comfort Sides",
    "servingSize": "4 oz",
    "calories": 67,
    "protein": 7.6,
    "carbs": 10.3,
    "fat": 0.2,
    "fiber": 2.6,
    "sugar": 2.1,
    "sodium": 60.7,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "220137*1-19-Di",
    "name": "Cotija Cheese",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Terp Comfort Sides",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 6.1,
    "carbs": 0.0,
    "fat": 8.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 435.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "145214*3-19-Di",
    "name": "Rice Kheer",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Terp Comfort Sides",
    "servingSize": "3 oz",
    "calories": 89,
    "protein": 3.8,
    "carbs": 11.2,
    "fat": 3.4,
    "fiber": 0.1,
    "sugar": 4.9,
    "sodium": 46.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "019403*2-19-Di",
    "name": "Cornbread",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Terp Comfort Sides",
    "servingSize": "2 oz",
    "calories": 235,
    "protein": 2.9,
    "carbs": 29.3,
    "fat": 10.8,
    "fiber": 1.0,
    "sugar": 14.7,
    "sodium": 146.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "080286*4-19-Di",
    "name": "Asian Chicken Mongolian Grill",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Woks",
    "servingSize": "4 oz",
    "calories": 125,
    "protein": 26.3,
    "carbs": 0.0,
    "fat": 1.4,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 74.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "050181*4-19-Di",
    "name": "Asian Beef Mongolian Grill",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Woks",
    "servingSize": "4 oz",
    "calories": 243,
    "protein": 22.7,
    "carbs": 0.0,
    "fat": 15.9,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 57.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "903382*4-19-Di",
    "name": "Japanese Egg Salad",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Woks",
    "servingSize": "4 oz",
    "calories": 78,
    "protein": 3.7,
    "carbs": 1.7,
    "fat": 6.6,
    "fiber": 0.1,
    "sugar": 0.6,
    "sodium": 183.7,
    "allergens": [
      "eggs",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "115188*3-19-Di",
    "name": "Cooked Lo Mein",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Woks",
    "servingSize": "3 OZ",
    "calories": 94,
    "protein": 3.6,
    "carbs": 17.8,
    "fat": 1.0,
    "fiber": 0.5,
    "sugar": 0.2,
    "sodium": 75.8,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100409*1-19-Di",
    "name": "Egg Roll w/ Sweet and Sour Sauce",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Woks",
    "servingSize": "1 each",
    "calories": 199,
    "protein": 3.0,
    "carbs": 33.9,
    "fat": 5.3,
    "fiber": 2.0,
    "sugar": 15.4,
    "sodium": 657.3,
    "allergens": [
      "eggs",
      "gluten",
      "sesame",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "903348*1-19-Di",
    "name": "Chopped Ginger",
    "diningHall": "Yahentamitsi Dining Hall",
    "mealPeriod": "Dinner",
    "station": "Woks",
    "servingSize": "1 oz",
    "calories": 98,
    "protein": 2.6,
    "carbs": 20.1,
    "fat": 1.7,
    "fiber": 3.7,
    "sugar": 0.9,
    "sodium": 9.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090327*3-51-Br",
    "name": "Oatmeal",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Harvest Daily Breakfast",
    "servingSize": "3 oz",
    "calories": 340,
    "protein": 11.3,
    "carbs": 61.2,
    "fat": 6.8,
    "fiber": 9.1,
    "sugar": 2.3,
    "sodium": 3.6,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "119360*1-51-Br",
    "name": "Bagels",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Harvest Daily Breakfast",
    "servingSize": "1 ea",
    "calories": 295,
    "protein": 10.0,
    "carbs": 60.5,
    "fat": 1.2,
    "fiber": 4.7,
    "sugar": 5.0,
    "sodium": 376.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "sesame",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "100219*4-51-Br",
    "name": "Chicken Congee",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Harvest Daily Breakfast",
    "servingSize": "4 oz",
    "calories": 212,
    "protein": 9.2,
    "carbs": 36.0,
    "fat": 5.2,
    "fiber": 0.8,
    "sugar": 2.8,
    "sodium": 609.5,
    "allergens": [
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090331*1-51-Br",
    "name": "Plain Cream Cheese",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Harvest Daily Breakfast",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 9.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 96.2,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090311*5-51-Br",
    "name": "Special K Strawberry",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Harvest Daily Breakfast",
    "servingSize": "5 oz",
    "calories": 503,
    "protein": 9.1,
    "carbs": 123.5,
    "fat": 0.0,
    "fiber": 13.7,
    "sugar": 41.2,
    "sodium": 868.8,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "903343*4-51-Br",
    "name": "Vanilla Greek Yogurt",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Harvest Daily Breakfast",
    "servingSize": "4 oz",
    "calories": 86,
    "protein": 9.1,
    "carbs": 14.6,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 13.6,
    "sodium": 37.8,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "060063*1-51-Br",
    "name": "Pork Sausage Link",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone",
    "servingSize": "1 ea",
    "calories": 189,
    "protein": 8.0,
    "carbs": 2.0,
    "fat": 16.9,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 517.3,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "101074*3-51-Br",
    "name": "Mango Chia Pudding",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone",
    "servingSize": "3 oz",
    "calories": 133,
    "protein": 4.7,
    "carbs": 16.0,
    "fat": 6.1,
    "fiber": 0.9,
    "sugar": 6.5,
    "sodium": 25.5,
    "allergens": [
      "coconut"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100208*1-51-Br",
    "name": "Vegan Pancake Gluten Free",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone",
    "servingSize": "1 each",
    "calories": 128,
    "protein": 2.5,
    "carbs": 22.6,
    "fat": 3.0,
    "fiber": 0.7,
    "sugar": 3.4,
    "sodium": 119.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "101029*1-51-Br",
    "name": "Avocado Toast",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone",
    "servingSize": "1 EACH",
    "calories": 175,
    "protein": 2.1,
    "carbs": 26.3,
    "fat": 9.5,
    "fiber": 3.9,
    "sugar": 3.1,
    "sodium": 172.3,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151266*3-51-Br",
    "name": "Shoestring Potato Hashbrowns",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone",
    "servingSize": "3 oz",
    "calories": 117,
    "protein": 1.9,
    "carbs": 16.7,
    "fat": 4.5,
    "fiber": 1.3,
    "sugar": 0.0,
    "sodium": 438.6,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "101050*2-51-Br",
    "name": "Strawberry Compote",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone",
    "servingSize": "2 oz",
    "calories": 63,
    "protein": 0.3,
    "carbs": 15.4,
    "fat": 0.0,
    "fiber": 0.5,
    "sugar": 13.7,
    "sodium": 0.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090204*2-51-Br",
    "name": "Chopped Kale",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "2 oz",
    "calories": 29,
    "protein": 2.9,
    "carbs": 5.5,
    "fat": 0.6,
    "fiber": 2.2,
    "sugar": 1.5,
    "sodium": 23.7,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100012*1-51-Br",
    "name": "Chocolate Chip Cookie Sweet Loren's",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "1 each",
    "calories": 120,
    "protein": 2.0,
    "carbs": 18.0,
    "fat": 5.0,
    "fiber": 1.0,
    "sugar": 10.0,
    "sodium": 65.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100014*1-51-Br",
    "name": "Fudgy Cookie Sweet Loren's",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "1 each",
    "calories": 110,
    "protein": 2.0,
    "carbs": 17.0,
    "fat": 5.0,
    "fiber": 2.0,
    "sugar": 10.0,
    "sodium": 85.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090201*2-51-Br",
    "name": "Spinach",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "2 oz",
    "calories": 13,
    "protein": 1.6,
    "carbs": 2.1,
    "fat": 0.2,
    "fiber": 1.2,
    "sugar": 0.2,
    "sodium": 44.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090203*2-51-Br",
    "name": "Chopped Romaine",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "2 oz",
    "calories": 10,
    "protein": 0.7,
    "carbs": 1.9,
    "fat": 0.2,
    "fiber": 1.2,
    "sugar": 0.7,
    "sodium": 4.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220218*2-51-Br",
    "name": "Balsamic Vinaigrette",
    "diningHall": "251 North",
    "mealPeriod": "Breakfast",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "2 oz",
    "calories": 139,
    "protein": 0.4,
    "carbs": 14.2,
    "fat": 8.0,
    "fiber": 0.8,
    "sugar": 12.3,
    "sodium": 286.4,
    "allergens": [
      "alcohol"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "085312*1-51-Lu",
    "name": "Mango Salsa",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Extras",
    "servingSize": "1 oz",
    "calories": 17,
    "protein": 0.2,
    "carbs": 3.8,
    "fat": 0.1,
    "fiber": 0.5,
    "sugar": 3.8,
    "sodium": 5.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151334*1-51-Lu",
    "name": "Guava BBQ",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Extras",
    "servingSize": "1 oz",
    "calories": 47,
    "protein": 0.0,
    "carbs": 11.8,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 11.0,
    "sodium": 307.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "080590*4-51-Lu",
    "name": "Jerk Chicken",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Mains",
    "servingSize": "4 oz",
    "calories": 79,
    "protein": 12.1,
    "carbs": 1.4,
    "fat": 2.8,
    "fiber": 0.4,
    "sugar": 0.5,
    "sodium": 235.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "150101*3-51-Lu",
    "name": "Parmesan Roasted Potatoes",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Mains",
    "servingSize": "3 oz",
    "calories": 227,
    "protein": 11.4,
    "carbs": 18.6,
    "fat": 15.1,
    "fiber": 2.2,
    "sugar": 1.2,
    "sodium": 463.8,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "151328*3-51-Lu",
    "name": "Trinidadian Chana",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Mains",
    "servingSize": "3 oz",
    "calories": 250,
    "protein": 7.7,
    "carbs": 37.1,
    "fat": 8.7,
    "fiber": 15.3,
    "sugar": 3.3,
    "sodium": 47.1,
    "allergens": [
      "coconut",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151097*3-51-Lu",
    "name": "Cuban Black Bean and Rice",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Mains",
    "servingSize": "3 oz",
    "calories": 121,
    "protein": 4.4,
    "carbs": 24.0,
    "fat": 0.4,
    "fiber": 2.5,
    "sugar": 0.0,
    "sodium": 144.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100308*3-51-Lu",
    "name": "Cilantro SoFrito Brown Rice",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Mains",
    "servingSize": "3 oz",
    "calories": 107,
    "protein": 2.5,
    "carbs": 21.9,
    "fat": 0.8,
    "fiber": 0.1,
    "sugar": 0.4,
    "sodium": 68.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "141112*4-51-Lu",
    "name": "Jerk Spice Roasted Yukon Gold Potatoes",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Chef's Table Mains",
    "servingSize": "4 oz",
    "calories": 102,
    "protein": 2.3,
    "carbs": 19.9,
    "fat": 1.2,
    "fiber": 1.5,
    "sugar": 0.0,
    "sodium": 92.7,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "102000*4-51-Lu",
    "name": "Vanilla Ice Cream",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "CHILLZ",
    "servingSize": "4 oz",
    "calories": 220,
    "protein": 3.4,
    "carbs": 27.1,
    "fat": 11.8,
    "fiber": 0.0,
    "sugar": 18.6,
    "sodium": 93.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102023*2-51-Lu",
    "name": "Warm Brownie Cheesecake",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "CHILLZ",
    "servingSize": "2 oz",
    "calories": 220,
    "protein": 3.2,
    "carbs": 27.5,
    "fat": 7.0,
    "fiber": 1.1,
    "sugar": 1.7,
    "sodium": 122.2,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102022*2-51-Lu",
    "name": "Warm Brownie",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "CHILLZ",
    "servingSize": "2 oz",
    "calories": 236,
    "protein": 2.1,
    "carbs": 31.3,
    "fat": 6.6,
    "fiber": 1.3,
    "sugar": 2.0,
    "sodium": 123.4,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102001*4-51-Lu",
    "name": "Chocolate Ice Cream",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "CHILLZ",
    "servingSize": "4 oz",
    "calories": 154,
    "protein": 2.0,
    "carbs": 16.4,
    "fat": 9.0,
    "fiber": 0.0,
    "sugar": 14.9,
    "sodium": 54.8,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102006*1-51-Lu",
    "name": "Chocolate Chips",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "CHILLZ",
    "servingSize": "1 oz",
    "calories": 136,
    "protein": 1.2,
    "carbs": 17.9,
    "fat": 8.5,
    "fiber": 1.7,
    "sugar": 15.5,
    "sodium": 3.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102003*1-51-Lu",
    "name": "Oreo Pieces",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "CHILLZ",
    "servingSize": "1 oz",
    "calories": 136,
    "protein": 1.1,
    "carbs": 21.0,
    "fat": 5.3,
    "fiber": 1.1,
    "sugar": 11.6,
    "sodium": 110.3,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "080569*4-51-Lu",
    "name": "Buttermilk Fried Chicken Legs",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao All-Day",
    "servingSize": "4 oz",
    "calories": 360,
    "protein": 19.2,
    "carbs": 39.0,
    "fat": 14.1,
    "fiber": 0.3,
    "sugar": 0.7,
    "sodium": 952.2,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "090101*3-51-Lu",
    "name": "Mediterranean Grilled Cod",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao All-Day",
    "servingSize": "3 oz",
    "calories": 90,
    "protein": 15.0,
    "carbs": 3.8,
    "fat": 1.4,
    "fiber": 0.2,
    "sugar": 0.2,
    "sodium": 65.6,
    "allergens": [
      "fish",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "115147*4-51-Lu",
    "name": "Manicotti Cremini Mushroom Cream Sauce",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao All-Day",
    "servingSize": "4 oz",
    "calories": 185,
    "protein": 7.5,
    "carbs": 13.5,
    "fat": 11.2,
    "fiber": 0.7,
    "sugar": 2.8,
    "sodium": 283.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117081*1-51-Lu",
    "name": "Cheddar Garlic Cheesy Bread",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao All-Day",
    "servingSize": "1 each",
    "calories": 180,
    "protein": 6.0,
    "carbs": 15.8,
    "fat": 10.6,
    "fiber": 0.5,
    "sugar": 0.5,
    "sodium": 238.5,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090205*2-51-Lu",
    "name": "Herb Quinoa",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao All-Day",
    "servingSize": "2 oz",
    "calories": 213,
    "protein": 6.0,
    "carbs": 36.8,
    "fat": 3.2,
    "fiber": 3.8,
    "sugar": 0.0,
    "sodium": 122.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150379*3-51-Lu",
    "name": "Peas and Caramelized Red Onions",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao All-Day",
    "servingSize": "3 oz",
    "calories": 59,
    "protein": 3.5,
    "carbs": 10.3,
    "fat": 0.4,
    "fiber": 3.1,
    "sugar": 3.8,
    "sodium": 24.8,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090538*2-51-Lu",
    "name": "Macaroni Salad",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao Chilled Salads",
    "servingSize": "2 oz",
    "calories": 185,
    "protein": 6.1,
    "carbs": 36.8,
    "fat": 1.9,
    "fiber": 1.9,
    "sugar": 1.9,
    "sodium": 98.5,
    "allergens": [
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090554*2-51-Lu",
    "name": "Southern Caviar",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao Chilled Salads",
    "servingSize": "2 oz",
    "calories": 35,
    "protein": 1.4,
    "carbs": 7.1,
    "fat": 0.3,
    "fiber": 0.8,
    "sugar": 1.7,
    "sodium": 205.6,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151324*3-51-Lu",
    "name": "Artichoke Green Bean Salad",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao Chilled Salads",
    "servingSize": "3 oz",
    "calories": 52,
    "protein": 0.9,
    "carbs": 6.1,
    "fat": 3.1,
    "fiber": 1.4,
    "sugar": 2.3,
    "sodium": 196.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220178*4-51-Lu",
    "name": "Mixed Fruit with Mint",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao Chilled Salads",
    "servingSize": "4 oz",
    "calories": 59,
    "protein": 0.6,
    "carbs": 15.3,
    "fat": 0.0,
    "fiber": 1.0,
    "sugar": 14.0,
    "sodium": 9.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "135167*1-51-Lu",
    "name": "Tartar Sauce",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao Chilled Salads",
    "servingSize": "1 oz",
    "calories": 30,
    "protein": 0.0,
    "carbs": 0.2,
    "fat": 3.2,
    "fiber": 0.0,
    "sugar": 0.2,
    "sodium": 53.6,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117110*1-51-Lu",
    "name": "Hawaiian Pizza",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao Pizza",
    "servingSize": "1 ea",
    "calories": 500,
    "protein": 24.7,
    "carbs": 47.8,
    "fat": 22.3,
    "fiber": 8.8,
    "sugar": 30.3,
    "sodium": 1648.5,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "117076*1-51-Lu",
    "name": "Cheese Pizza",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao Pizza",
    "servingSize": "1 slice",
    "calories": 177,
    "protein": 13.2,
    "carbs": 14.0,
    "fat": 9.1,
    "fiber": 0.9,
    "sugar": 1.5,
    "sodium": 337.2,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117101*1-51-Lu",
    "name": "Vegetable Pizza",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Ciao Pizza",
    "servingSize": "1 slice",
    "calories": 162,
    "protein": 13.1,
    "carbs": 10.1,
    "fat": 9.2,
    "fiber": 0.8,
    "sugar": 1.7,
    "sodium": 321.4,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "080516*4-51-Lu",
    "name": "Jerk Chicken",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Halal at Chef's Table",
    "servingSize": "4 oz",
    "calories": 121,
    "protein": 16.3,
    "carbs": 5.6,
    "fat": 2.8,
    "fiber": 0.4,
    "sugar": 4.6,
    "sodium": 2707.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "145001*3-51-Lu",
    "name": "White Rice",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Halal at Chef's Table",
    "servingSize": "3 oz",
    "calories": 102,
    "protein": 2.4,
    "carbs": 22.3,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 2.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150339*3-51-Lu",
    "name": "Snap Peas & Carrots w/ Sesame",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Halal at Chef's Table",
    "servingSize": "3 oz",
    "calories": 39,
    "protein": 1.3,
    "carbs": 6.9,
    "fat": 0.9,
    "fiber": 2.1,
    "sugar": 3.9,
    "sodium": 39.9,
    "allergens": [
      "gluten",
      "pea_protein",
      "sesame",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150876*3-51-Lu",
    "name": "Roasted Zucchini Yellow Squash and Carrots",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Halal at Chef's Table",
    "servingSize": "3 oz",
    "calories": 23,
    "protein": 0.9,
    "carbs": 4.5,
    "fat": 0.5,
    "fiber": 1.3,
    "sugar": 2.0,
    "sodium": 40.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126721*1-51-Lu",
    "name": "Grilled Basil Pesto Chicken Thigh",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Harvest Entree",
    "servingSize": "1 each",
    "calories": 167,
    "protein": 22.5,
    "carbs": 0.9,
    "fat": 8.4,
    "fiber": 0.1,
    "sugar": 0.0,
    "sodium": 256.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "151293*3-51-Lu",
    "name": "Roasted Garlic Chili Tofu",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Harvest Greens",
    "servingSize": "3 oz",
    "calories": 137,
    "protein": 13.6,
    "carbs": 2.7,
    "fat": 9.2,
    "fiber": 0.9,
    "sugar": 0.0,
    "sodium": 99.4,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126380*3-51-Lu",
    "name": "Tuna Salad",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Harvest Greens",
    "servingSize": "3 oz",
    "calories": 130,
    "protein": 12.6,
    "carbs": 2.3,
    "fat": 7.9,
    "fiber": 0.1,
    "sugar": 0.3,
    "sodium": 321.6,
    "allergens": [
      "eggs",
      "fish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090271*1-51-Lu",
    "name": "Bacon Bits",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Harvest Greens",
    "servingSize": "1 oz",
    "calories": 127,
    "protein": 12.0,
    "carbs": 0.5,
    "fat": 8.7,
    "fiber": 0.2,
    "sugar": 0.5,
    "sodium": 603.5,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "100495*2-51-Lu",
    "name": "Ranch Chickpea",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Harvest Greens",
    "servingSize": "2 oz",
    "calories": 211,
    "protein": 11.0,
    "carbs": 35.4,
    "fat": 3.5,
    "fiber": 9.9,
    "sugar": 6.4,
    "sodium": 25.4,
    "allergens": [
      "dairy",
      "pea_protein",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090393*1-51-Lu",
    "name": "Shredded Parmesan Cheese",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Harvest Greens",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 7.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 435.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090269*2-51-Lu",
    "name": "Eggs",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Harvest Greens",
    "servingSize": "2 oz",
    "calories": 96,
    "protein": 8.4,
    "carbs": 1.2,
    "fat": 7.2,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 84.1,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "100911*1-51-Lu",
    "name": "Vegan Buffalo Chicken Black Bean Quesadilla",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Harvest Vegan",
    "servingSize": "1 each",
    "calories": 812,
    "protein": 36.0,
    "carbs": 86.9,
    "fat": 38.5,
    "fiber": 7.5,
    "sugar": 3.9,
    "sodium": 2354.3,
    "allergens": [
      "gluten",
      "pea_protein",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100902*4-51-Lu",
    "name": "Vegan Chicken and Artichoke Stew",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Harvest Vegan",
    "servingSize": "4 oz",
    "calories": 73,
    "protein": 10.1,
    "carbs": 4.8,
    "fat": 1.8,
    "fiber": 1.0,
    "sugar": 2.0,
    "sodium": 222.1,
    "allergens": [
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100329*4-51-Lu",
    "name": "Brown Rice",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Harvest Vegan",
    "servingSize": "4 oz",
    "calories": 134,
    "protein": 2.7,
    "carbs": 28.3,
    "fat": 1.0,
    "fiber": 1.3,
    "sugar": 0.0,
    "sodium": 41.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150144*3-51-Lu",
    "name": "Roasted Zucchini and Red Pepper",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Harvest Vegan",
    "servingSize": "3 oz",
    "calories": 21,
    "protein": 0.8,
    "carbs": 3.2,
    "fat": 0.8,
    "fiber": 1.0,
    "sugar": 1.6,
    "sodium": 55.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "080863*1-51-Lu",
    "name": "Grilled Kati Kati Chicken",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Purple Zone",
    "servingSize": "1 ea",
    "calories": 354,
    "protein": 30.4,
    "carbs": 1.3,
    "fat": 25.1,
    "fiber": 0.1,
    "sugar": 0.6,
    "sodium": 306.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "126036*1-51-Lu",
    "name": "Grilled Chicken Breast",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Purple Zone",
    "servingSize": "1 each",
    "calories": 180,
    "protein": 24.4,
    "carbs": 1.9,
    "fat": 7.7,
    "fiber": 0.2,
    "sugar": 0.0,
    "sodium": 97.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "080582*4-51-Lu",
    "name": "Lebanese Grilled Chicken",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Purple Zone",
    "servingSize": "4 oz",
    "calories": 157,
    "protein": 20.6,
    "carbs": 1.1,
    "fat": 7.8,
    "fiber": 0.1,
    "sugar": 0.3,
    "sodium": 329.6,
    "allergens": [
      "coconut",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "111032*4-51-Lu",
    "name": "Rotini Chickpea Pasta",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Purple Zone",
    "servingSize": "4 oz",
    "calories": 180,
    "protein": 8.3,
    "carbs": 25.5,
    "fat": 6.8,
    "fiber": 6.0,
    "sugar": 1.5,
    "sodium": 211.3,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "145209*4-51-Lu",
    "name": "Persian Green Herb Rice",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Purple Zone",
    "servingSize": "4 oz",
    "calories": 183,
    "protein": 3.2,
    "carbs": 32.3,
    "fat": 4.6,
    "fiber": 1.0,
    "sugar": 0.4,
    "sodium": 323.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151386*3-51-Lu",
    "name": "Roasted Broccoli & Red Pepper",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Purple Zone",
    "servingSize": "3 oz",
    "calories": 68,
    "protein": 2.2,
    "carbs": 4.5,
    "fat": 5.2,
    "fiber": 1.6,
    "sugar": 1.6,
    "sodium": 125.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100012*1-51-Lu",
    "name": "Chocolate Chip Cookie Sweet Loren's",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "1 each",
    "calories": 120,
    "protein": 2.0,
    "carbs": 18.0,
    "fat": 5.0,
    "fiber": 1.0,
    "sugar": 10.0,
    "sodium": 65.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100014*1-51-Lu",
    "name": "Fudgy Cookie Sweet Loren's",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "1 each",
    "calories": 110,
    "protein": 2.0,
    "carbs": 17.0,
    "fat": 5.0,
    "fiber": 2.0,
    "sugar": 10.0,
    "sodium": 85.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090201*2-51-Lu",
    "name": "Spinach",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "2 oz",
    "calories": 13,
    "protein": 1.6,
    "carbs": 2.1,
    "fat": 0.2,
    "fiber": 1.2,
    "sugar": 0.2,
    "sodium": 44.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220218*2-51-Lu",
    "name": "Balsamic Vinaigrette",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "2 oz",
    "calories": 139,
    "protein": 0.4,
    "carbs": 14.2,
    "fat": 8.0,
    "fiber": 0.8,
    "sugar": 12.3,
    "sodium": 286.4,
    "allergens": [
      "alcohol"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090293*1-51-Lu",
    "name": "Green Pepper Diced",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "1 oz",
    "calories": 4,
    "protein": 0.3,
    "carbs": 0.9,
    "fat": 0.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 0.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090370*2-51-Lu",
    "name": "Sliced Roma Tomatoes",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "2 oz",
    "calories": 5,
    "protein": 0.3,
    "carbs": 1.1,
    "fat": 0.0,
    "fiber": 0.3,
    "sugar": 0.8,
    "sodium": 1.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126300*1-51-Lu",
    "name": "Beef Burger",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Burger",
    "servingSize": "1 each",
    "calories": 261,
    "protein": 17.0,
    "carbs": 6.7,
    "fat": 18.7,
    "fiber": 0.4,
    "sugar": 0.6,
    "sodium": 529.2,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "220147*1-51-Lu",
    "name": "Sliced Pepper Jack Cheese",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Burger",
    "servingSize": "1 oz",
    "calories": 108,
    "protein": 6.8,
    "carbs": 1.4,
    "fat": 8.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 175.5,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220084*1-51-Lu",
    "name": "Provolone Cheese Sliced",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Burger",
    "servingSize": "1 each",
    "calories": 76,
    "protein": 5.3,
    "carbs": 0.0,
    "fat": 6.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 182.3,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119388*1-51-Lu",
    "name": "Potato Hamburger Roll",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Burger",
    "servingSize": "1 each",
    "calories": 123,
    "protein": 3.8,
    "carbs": 22.6,
    "fat": 1.9,
    "fiber": 0.9,
    "sugar": 1.9,
    "sodium": 198.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "126339*1-51-Lu",
    "name": "Buffalo Chicken Cheddar Wrap w/ Ranch, Lettuce & Tomato",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Deli",
    "servingSize": "1 ea",
    "calories": 580,
    "protein": 33.3,
    "carbs": 46.7,
    "fat": 28.7,
    "fiber": 4.1,
    "sugar": 6.8,
    "sodium": 1684.2,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "126386*1-51-Lu",
    "name": "Cheese Quesadilla",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Deli",
    "servingSize": "1 each",
    "calories": 667,
    "protein": 30.3,
    "carbs": 55.5,
    "fat": 37.6,
    "fiber": 5.0,
    "sugar": 1.0,
    "sodium": 1223.2,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "126379*3-51-Lu",
    "name": "Ham Sliced",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Deli",
    "servingSize": "3 oz",
    "calories": 106,
    "protein": 13.7,
    "carbs": 4.6,
    "fat": 3.0,
    "fiber": 0.0,
    "sugar": 4.6,
    "sodium": 1002.4,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "126378*3-51-Lu",
    "name": "Turkey Sliced",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Deli",
    "servingSize": "3 oz",
    "calories": 76,
    "protein": 13.7,
    "carbs": 1.5,
    "fat": 1.5,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 683.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "126381*3-51-Lu",
    "name": "Chicken Salad",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Deli",
    "servingSize": "3 oz",
    "calories": 207,
    "protein": 13.5,
    "carbs": 4.0,
    "fat": 15.4,
    "fiber": 0.2,
    "sugar": 0.2,
    "sodium": 1076.5,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "019374*2-51-Lu",
    "name": "Pullman White Bread Sliced",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Deli",
    "servingSize": "2 slices",
    "calories": 213,
    "protein": 6.4,
    "carbs": 40.5,
    "fat": 2.1,
    "fiber": 2.1,
    "sugar": 2.1,
    "sodium": 447.3,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "080259*4-51-Lu",
    "name": "Chicken Philly Meat",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Hot Sub",
    "servingSize": "4 oz",
    "calories": 125,
    "protein": 26.3,
    "carbs": 0.0,
    "fat": 1.4,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 74.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "019377*1-51-Lu",
    "name": "Hoagie Roll White",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Hot Sub",
    "servingSize": "1 each",
    "calories": 229,
    "protein": 8.4,
    "carbs": 45.8,
    "fat": 1.8,
    "fiber": 1.2,
    "sugar": 2.4,
    "sodium": 457.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220110*1-51-Lu",
    "name": "Spicy Brown Mustard",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Hot Sub",
    "servingSize": "1 oz",
    "calories": 148,
    "protein": 7.9,
    "carbs": 11.0,
    "fat": 9.1,
    "fiber": 4.6,
    "sugar": 2.1,
    "sodium": 1.6,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220082*1-51-Lu",
    "name": "American Cheese Sliced",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Hot Sub",
    "servingSize": "1 each",
    "calories": 56,
    "protein": 3.0,
    "carbs": 0.5,
    "fat": 4.6,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 182.3,
    "allergens": [
      "dairy",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150180*1-51-Lu",
    "name": "Tabasco Onions",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Hot Sub",
    "servingSize": "1 oz",
    "calories": 80,
    "protein": 2.4,
    "carbs": 16.9,
    "fat": 0.3,
    "fiber": 0.9,
    "sugar": 1.7,
    "sodium": 30.4,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150319*1-51-Lu",
    "name": "Grilled Mushrooms",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Smash Hot Sub",
    "servingSize": "1 oz",
    "calories": 16,
    "protein": 2.0,
    "carbs": 2.0,
    "fat": 0.3,
    "fiber": 0.7,
    "sugar": 0.0,
    "sodium": 10.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090339*6-51-Lu",
    "name": "Beef Chili with Beans",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Soups",
    "servingSize": "6 oz",
    "calories": 233,
    "protein": 14.1,
    "carbs": 19.0,
    "fat": 11.3,
    "fiber": 4.9,
    "sugar": 5.6,
    "sodium": 712.4,
    "allergens": [
      "dairy",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090345*6-51-Lu",
    "name": "Vegan Southwestern 3 Bean Soup",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Soups",
    "servingSize": "6 oz",
    "calories": 143,
    "protein": 8.3,
    "carbs": 26.6,
    "fat": 0.5,
    "fiber": 6.9,
    "sugar": 4.4,
    "sodium": 544.3,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090368*6-51-Lu",
    "name": "New England Clam Chowder",
    "diningHall": "251 North",
    "mealPeriod": "Lunch",
    "station": "Soups",
    "servingSize": "6 oz",
    "calories": 158,
    "protein": 4.3,
    "carbs": 21.6,
    "fat": 5.8,
    "fiber": 1.4,
    "sugar": 1.4,
    "sodium": 1137.6,
    "allergens": [
      "dairy",
      "gluten",
      "shellfish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "150101*3-51-Di",
    "name": "Parmesan Roasted Potatoes",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Extras",
    "servingSize": "3 oz",
    "calories": 227,
    "protein": 11.4,
    "carbs": 18.6,
    "fat": 15.1,
    "fiber": 2.2,
    "sugar": 1.2,
    "sodium": 463.8,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "151097*3-51-Di",
    "name": "Cuban Black Bean and Rice",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Extras",
    "servingSize": "3 oz",
    "calories": 121,
    "protein": 4.4,
    "carbs": 24.0,
    "fat": 0.4,
    "fiber": 2.5,
    "sugar": 0.0,
    "sodium": 144.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "141112*4-51-Di",
    "name": "Jerk Spice Roasted Yukon Gold Potatoes",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Extras",
    "servingSize": "4 oz",
    "calories": 102,
    "protein": 2.3,
    "carbs": 19.9,
    "fat": 1.2,
    "fiber": 1.5,
    "sugar": 0.0,
    "sodium": 92.7,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150371*2-51-Di",
    "name": "Fried Plantains",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Extras",
    "servingSize": "2 oz",
    "calories": 102,
    "protein": 1.1,
    "carbs": 19.3,
    "fat": 2.0,
    "fiber": 1.1,
    "sugar": 13.6,
    "sodium": 14.2,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151362*3-51-Di",
    "name": "Lemon Basil Roasted Carrots",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Extras",
    "servingSize": "3 oz",
    "calories": 75,
    "protein": 0.9,
    "carbs": 8.8,
    "fat": 4.4,
    "fiber": 2.7,
    "sugar": 4.2,
    "sodium": 165.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151333*3-51-Di",
    "name": "Carribean Coleslaw",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Extras",
    "servingSize": "3 oz",
    "calories": 48,
    "protein": 0.3,
    "carbs": 1.9,
    "fat": 4.4,
    "fiber": 0.2,
    "sugar": 1.1,
    "sodium": 34.6,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "080590*4-51-Di",
    "name": "Jerk Chicken",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Mains",
    "servingSize": "4 oz",
    "calories": 79,
    "protein": 12.1,
    "carbs": 1.4,
    "fat": 2.8,
    "fiber": 0.4,
    "sugar": 0.5,
    "sodium": 235.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "090004*4-51-Di",
    "name": "Jamaican Curry Shrimp",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Mains",
    "servingSize": "4 oz",
    "calories": 151,
    "protein": 0.9,
    "carbs": 12.2,
    "fat": 12.5,
    "fiber": 1.0,
    "sugar": 5.9,
    "sodium": 641.7,
    "allergens": [
      "coconut",
      "shellfish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "151328*3-51-Di",
    "name": "Trinidadian Chana",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Vegetarian",
    "servingSize": "3 oz",
    "calories": 250,
    "protein": 7.7,
    "carbs": 37.1,
    "fat": 8.7,
    "fiber": 15.3,
    "sugar": 3.3,
    "sodium": 47.1,
    "allergens": [
      "coconut",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100308*3-51-Di",
    "name": "Cilantro SoFrito Brown Rice",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Vegetarian",
    "servingSize": "3 oz",
    "calories": 107,
    "protein": 2.5,
    "carbs": 21.9,
    "fat": 0.8,
    "fiber": 0.1,
    "sugar": 0.4,
    "sodium": 68.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151357*3-51-Di",
    "name": "Jamaican Vegetable Rundown",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Vegetarian",
    "servingSize": "3 oz",
    "calories": 44,
    "protein": 1.3,
    "carbs": 9.1,
    "fat": 1.0,
    "fiber": 1.5,
    "sugar": 2.3,
    "sodium": 61.6,
    "allergens": [
      "coconut"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150866*3-51-Di",
    "name": "Roasted Zucchini and Carrots",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Chef's Table Vegetarian",
    "servingSize": "3 oz",
    "calories": 27,
    "protein": 1.0,
    "carbs": 4.6,
    "fat": 0.8,
    "fiber": 1.2,
    "sugar": 1.7,
    "sodium": 65.3,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "102000*4-51-Di",
    "name": "Vanilla Ice Cream",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "CHILLZ",
    "servingSize": "4 oz",
    "calories": 220,
    "protein": 3.4,
    "carbs": 27.1,
    "fat": 11.8,
    "fiber": 0.0,
    "sugar": 18.6,
    "sodium": 93.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102023*2-51-Di",
    "name": "Warm Brownie Cheesecake",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "CHILLZ",
    "servingSize": "2 oz",
    "calories": 220,
    "protein": 3.2,
    "carbs": 27.5,
    "fat": 7.0,
    "fiber": 1.1,
    "sugar": 1.7,
    "sodium": 122.2,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102022*2-51-Di",
    "name": "Warm Brownie",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "CHILLZ",
    "servingSize": "2 oz",
    "calories": 236,
    "protein": 2.1,
    "carbs": 31.3,
    "fat": 6.6,
    "fiber": 1.3,
    "sugar": 2.0,
    "sodium": 123.4,
    "allergens": [
      "alcohol",
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102001*4-51-Di",
    "name": "Chocolate Ice Cream",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "CHILLZ",
    "servingSize": "4 oz",
    "calories": 154,
    "protein": 2.0,
    "carbs": 16.4,
    "fat": 9.0,
    "fiber": 0.0,
    "sugar": 14.9,
    "sodium": 54.8,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102006*1-51-Di",
    "name": "Chocolate Chips",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "CHILLZ",
    "servingSize": "1 oz",
    "calories": 136,
    "protein": 1.2,
    "carbs": 17.9,
    "fat": 8.5,
    "fiber": 1.7,
    "sugar": 15.5,
    "sodium": 3.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "102003*1-51-Di",
    "name": "Oreo Pieces",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "CHILLZ",
    "servingSize": "1 oz",
    "calories": 136,
    "protein": 1.1,
    "carbs": 21.0,
    "fat": 5.3,
    "fiber": 1.1,
    "sugar": 11.6,
    "sodium": 110.3,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "peanuts",
      "soy",
      "tree_nuts"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "080569*4-51-Di",
    "name": "Buttermilk Fried Chicken Legs",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao All-Day",
    "servingSize": "4 oz",
    "calories": 360,
    "protein": 19.2,
    "carbs": 39.0,
    "fat": 14.1,
    "fiber": 0.3,
    "sugar": 0.7,
    "sodium": 952.2,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "090101*3-51-Di",
    "name": "Mediterranean Grilled Cod",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao All-Day",
    "servingSize": "3 oz",
    "calories": 90,
    "protein": 15.0,
    "carbs": 3.8,
    "fat": 1.4,
    "fiber": 0.2,
    "sugar": 0.2,
    "sodium": 65.6,
    "allergens": [
      "fish",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "115147*4-51-Di",
    "name": "Manicotti Cremini Mushroom Cream Sauce",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao All-Day",
    "servingSize": "4 oz",
    "calories": 185,
    "protein": 7.5,
    "carbs": 13.5,
    "fat": 11.2,
    "fiber": 0.7,
    "sugar": 2.8,
    "sodium": 283.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090205*2-51-Di",
    "name": "Herb Quinoa",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao All-Day",
    "servingSize": "2 oz",
    "calories": 213,
    "protein": 6.0,
    "carbs": 36.8,
    "fat": 3.2,
    "fiber": 3.8,
    "sugar": 0.0,
    "sodium": 122.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "019373*1-51-Di",
    "name": "Assorted Mini Rolls",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao All-Day",
    "servingSize": "1 each",
    "calories": 141,
    "protein": 4.3,
    "carbs": 25.2,
    "fat": 2.5,
    "fiber": 0.8,
    "sugar": 3.9,
    "sodium": 79.5,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150379*3-51-Di",
    "name": "Peas and Caramelized Red Onions",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao All-Day",
    "servingSize": "3 oz",
    "calories": 59,
    "protein": 3.5,
    "carbs": 10.3,
    "fat": 0.4,
    "fiber": 3.1,
    "sugar": 3.8,
    "sodium": 24.8,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090538*2-51-Di",
    "name": "Macaroni Salad",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao Chilled Salads",
    "servingSize": "2 oz",
    "calories": 185,
    "protein": 6.1,
    "carbs": 36.8,
    "fat": 1.9,
    "fiber": 1.9,
    "sugar": 1.9,
    "sodium": 98.5,
    "allergens": [
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090554*2-51-Di",
    "name": "Southern Caviar",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao Chilled Salads",
    "servingSize": "2 oz",
    "calories": 35,
    "protein": 1.4,
    "carbs": 7.1,
    "fat": 0.3,
    "fiber": 0.8,
    "sugar": 1.7,
    "sodium": 205.6,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151324*3-51-Di",
    "name": "Artichoke Green Bean Salad",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao Chilled Salads",
    "servingSize": "3 oz",
    "calories": 52,
    "protein": 0.9,
    "carbs": 6.1,
    "fat": 3.1,
    "fiber": 1.4,
    "sugar": 2.3,
    "sodium": 196.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220178*4-51-Di",
    "name": "Mixed Fruit with Mint",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao Chilled Salads",
    "servingSize": "4 oz",
    "calories": 59,
    "protein": 0.6,
    "carbs": 15.3,
    "fat": 0.0,
    "fiber": 1.0,
    "sugar": 14.0,
    "sodium": 9.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "135167*1-51-Di",
    "name": "Tartar Sauce",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao Chilled Salads",
    "servingSize": "1 oz",
    "calories": 30,
    "protein": 0.0,
    "carbs": 0.2,
    "fat": 3.2,
    "fiber": 0.0,
    "sugar": 0.2,
    "sodium": 53.6,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117110*1-51-Di",
    "name": "Hawaiian Pizza",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao Pizza",
    "servingSize": "1 ea",
    "calories": 500,
    "protein": 24.7,
    "carbs": 47.8,
    "fat": 22.3,
    "fiber": 8.8,
    "sugar": 30.3,
    "sodium": 1648.5,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "117076*1-51-Di",
    "name": "Cheese Pizza",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao Pizza",
    "servingSize": "1 slice",
    "calories": 177,
    "protein": 13.2,
    "carbs": 14.0,
    "fat": 9.1,
    "fiber": 0.9,
    "sugar": 1.5,
    "sodium": 337.2,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "117101*1-51-Di",
    "name": "Vegetable Pizza",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Ciao Pizza",
    "servingSize": "1 slice",
    "calories": 162,
    "protein": 13.1,
    "carbs": 10.1,
    "fat": 9.2,
    "fiber": 0.8,
    "sugar": 1.7,
    "sodium": 321.4,
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "080050*1-51-Di",
    "name": "Rotisserie Lemon Pepper Chicken",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Halal at Chef's Table",
    "servingSize": "1 each",
    "calories": 330,
    "protein": 27.4,
    "carbs": 0.5,
    "fat": 23.8,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 752.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "145001*3-51-Di",
    "name": "White Rice",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Halal at Chef's Table",
    "servingSize": "3 oz",
    "calories": 102,
    "protein": 2.4,
    "carbs": 22.3,
    "fat": 0.0,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 2.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150309*4-51-Di",
    "name": "Fresh Steamed Broccoli",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Halal at Chef's Table",
    "servingSize": "4 oz",
    "calories": 12,
    "protein": 1.5,
    "carbs": 1.9,
    "fat": 0.0,
    "fiber": 1.0,
    "sugar": 0.5,
    "sodium": 12.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150876*3-51-Di",
    "name": "Roasted Zucchini Yellow Squash and Carrots",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Halal at Chef's Table",
    "servingSize": "3 oz",
    "calories": 23,
    "protein": 0.9,
    "carbs": 4.5,
    "fat": 0.5,
    "fiber": 1.3,
    "sugar": 2.0,
    "sodium": 40.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126721*1-51-Di",
    "name": "Grilled Basil Pesto Chicken Thigh",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Harvest Entree",
    "servingSize": "1 each",
    "calories": 167,
    "protein": 22.5,
    "carbs": 0.9,
    "fat": 8.4,
    "fiber": 0.1,
    "sugar": 0.0,
    "sodium": 256.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "halal"
    ]
  },
  {
    "id": "151293*3-51-Di",
    "name": "Roasted Garlic Chili Tofu",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Harvest Greens",
    "servingSize": "3 oz",
    "calories": 137,
    "protein": 13.6,
    "carbs": 2.7,
    "fat": 9.2,
    "fiber": 0.9,
    "sugar": 0.0,
    "sodium": 99.4,
    "allergens": [
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126380*3-51-Di",
    "name": "Tuna Salad",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Harvest Greens",
    "servingSize": "3 oz",
    "calories": 130,
    "protein": 12.6,
    "carbs": 2.3,
    "fat": 7.9,
    "fiber": 0.1,
    "sugar": 0.3,
    "sodium": 321.6,
    "allergens": [
      "eggs",
      "fish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090271*1-51-Di",
    "name": "Bacon Bits",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Harvest Greens",
    "servingSize": "1 oz",
    "calories": 127,
    "protein": 12.0,
    "carbs": 0.5,
    "fat": 8.7,
    "fiber": 0.2,
    "sugar": 0.5,
    "sodium": 603.5,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "100495*2-51-Di",
    "name": "Ranch Chickpea",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Harvest Greens",
    "servingSize": "2 oz",
    "calories": 211,
    "protein": 11.0,
    "carbs": 35.4,
    "fat": 3.5,
    "fiber": 9.9,
    "sugar": 6.4,
    "sodium": 25.4,
    "allergens": [
      "dairy",
      "pea_protein",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "090393*1-51-Di",
    "name": "Shredded Parmesan Cheese",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Harvest Greens",
    "servingSize": "1 oz",
    "calories": 101,
    "protein": 9.1,
    "carbs": 1.0,
    "fat": 7.1,
    "fiber": 0.0,
    "sugar": 1.0,
    "sodium": 435.4,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090269*2-51-Di",
    "name": "Eggs",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Harvest Greens",
    "servingSize": "2 oz",
    "calories": 96,
    "protein": 8.4,
    "carbs": 1.2,
    "fat": 7.2,
    "fiber": 0.0,
    "sugar": 1.2,
    "sodium": 84.1,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "100911*1-51-Di",
    "name": "Vegan Buffalo Chicken Black Bean Quesadilla",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Harvest Vegan",
    "servingSize": "1 each",
    "calories": 812,
    "protein": 36.0,
    "carbs": 86.9,
    "fat": 38.5,
    "fiber": 7.5,
    "sugar": 3.9,
    "sodium": 2354.3,
    "allergens": [
      "gluten",
      "pea_protein",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100902*4-51-Di",
    "name": "Vegan Chicken and Artichoke Stew",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Harvest Vegan",
    "servingSize": "4 oz",
    "calories": 73,
    "protein": 10.1,
    "carbs": 4.8,
    "fat": 1.8,
    "fiber": 1.0,
    "sugar": 2.0,
    "sodium": 222.1,
    "allergens": [
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100329*4-51-Di",
    "name": "Brown Rice",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Harvest Vegan",
    "servingSize": "4 oz",
    "calories": 134,
    "protein": 2.7,
    "carbs": 28.3,
    "fat": 1.0,
    "fiber": 1.3,
    "sugar": 0.0,
    "sodium": 41.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150144*3-51-Di",
    "name": "Roasted Zucchini and Red Pepper",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Harvest Vegan",
    "servingSize": "3 oz",
    "calories": 21,
    "protein": 0.8,
    "carbs": 3.2,
    "fat": 0.8,
    "fiber": 1.0,
    "sugar": 1.6,
    "sodium": 55.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "080863*1-51-Di",
    "name": "Grilled Kati Kati Chicken",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Purple Zone",
    "servingSize": "1 ea",
    "calories": 354,
    "protein": 30.4,
    "carbs": 1.3,
    "fat": 25.1,
    "fiber": 0.1,
    "sugar": 0.6,
    "sodium": 306.9,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "126036*1-51-Di",
    "name": "Grilled Chicken Breast",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Purple Zone",
    "servingSize": "1 each",
    "calories": 180,
    "protein": 24.4,
    "carbs": 1.9,
    "fat": 7.7,
    "fiber": 0.2,
    "sugar": 0.0,
    "sodium": 97.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "080869*4-51-Di",
    "name": "Pumpkin Seed Suya Chicken",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Purple Zone",
    "servingSize": "4 oz",
    "calories": 147,
    "protein": 22.7,
    "carbs": 0.8,
    "fat": 6.0,
    "fiber": 0.2,
    "sugar": 0.0,
    "sodium": 236.5,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "111032*4-51-Di",
    "name": "Rotini Chickpea Pasta",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Purple Zone",
    "servingSize": "4 oz",
    "calories": 180,
    "protein": 8.3,
    "carbs": 25.5,
    "fat": 6.8,
    "fiber": 6.0,
    "sugar": 1.5,
    "sodium": 211.3,
    "allergens": [
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "145210*4-51-Di",
    "name": "Jollof Rice",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Purple Zone",
    "servingSize": "4 oz",
    "calories": 166,
    "protein": 3.3,
    "carbs": 32.6,
    "fat": 2.5,
    "fiber": 1.4,
    "sugar": 2.1,
    "sodium": 177.7,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "151375*3-51-Di",
    "name": "Roasted Harissa Cauliflower",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Purple Zone",
    "servingSize": "3 oz",
    "calories": 25,
    "protein": 1.7,
    "carbs": 4.7,
    "fat": 0.4,
    "fiber": 2.1,
    "sugar": 2.1,
    "sodium": 221.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100012*1-51-Di",
    "name": "Chocolate Chip Cookie Sweet Loren's",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "1 each",
    "calories": 120,
    "protein": 2.0,
    "carbs": 18.0,
    "fat": 5.0,
    "fiber": 1.0,
    "sugar": 10.0,
    "sodium": 65.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "100014*1-51-Di",
    "name": "Fudgy Cookie Sweet Loren's",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "1 each",
    "calories": 110,
    "protein": 2.0,
    "carbs": 17.0,
    "fat": 5.0,
    "fiber": 2.0,
    "sugar": 10.0,
    "sodium": 85.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090201*2-51-Di",
    "name": "Spinach",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "2 oz",
    "calories": 13,
    "protein": 1.6,
    "carbs": 2.1,
    "fat": 0.2,
    "fiber": 1.2,
    "sugar": 0.2,
    "sodium": 44.8,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220218*2-51-Di",
    "name": "Balsamic Vinaigrette",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "2 oz",
    "calories": 139,
    "protein": 0.4,
    "carbs": 14.2,
    "fat": 8.0,
    "fiber": 0.8,
    "sugar": 12.3,
    "sodium": 286.4,
    "allergens": [
      "alcohol"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090293*1-51-Di",
    "name": "Green Pepper Diced",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "1 oz",
    "calories": 4,
    "protein": 0.3,
    "carbs": 0.9,
    "fat": 0.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 0.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090370*2-51-Di",
    "name": "Sliced Roma Tomatoes",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Purple Zone-ALL DAY",
    "servingSize": "2 oz",
    "calories": 5,
    "protein": 0.3,
    "carbs": 1.1,
    "fat": 0.0,
    "fiber": 0.3,
    "sugar": 0.8,
    "sodium": 1.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "126300*1-51-Di",
    "name": "Beef Burger",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Burger",
    "servingSize": "1 each",
    "calories": 261,
    "protein": 17.0,
    "carbs": 6.7,
    "fat": 18.7,
    "fiber": 0.4,
    "sugar": 0.6,
    "sodium": 529.2,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "220147*1-51-Di",
    "name": "Sliced Pepper Jack Cheese",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Burger",
    "servingSize": "1 oz",
    "calories": 108,
    "protein": 6.8,
    "carbs": 1.4,
    "fat": 8.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 175.5,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220084*1-51-Di",
    "name": "Provolone Cheese Sliced",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Burger",
    "servingSize": "1 each",
    "calories": 76,
    "protein": 5.3,
    "carbs": 0.0,
    "fat": 6.1,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 182.3,
    "allergens": [
      "dairy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "119388*1-51-Di",
    "name": "Potato Hamburger Roll",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Burger",
    "servingSize": "1 each",
    "calories": 123,
    "protein": 3.8,
    "carbs": 22.6,
    "fat": 1.9,
    "fiber": 0.9,
    "sugar": 1.9,
    "sodium": 198.1,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "126339*1-51-Di",
    "name": "Buffalo Chicken Cheddar Wrap w/ Ranch, Lettuce & Tomato",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Deli",
    "servingSize": "1 ea",
    "calories": 580,
    "protein": 33.3,
    "carbs": 46.7,
    "fat": 28.7,
    "fiber": 4.1,
    "sugar": 6.8,
    "sodium": 1684.2,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "pea_protein"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "126386*1-51-Di",
    "name": "Cheese Quesadilla",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Deli",
    "servingSize": "1 each",
    "calories": 667,
    "protein": 30.3,
    "carbs": 55.5,
    "fat": 37.6,
    "fiber": 5.0,
    "sugar": 1.0,
    "sodium": 1223.2,
    "allergens": [
      "dairy",
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "126379*3-51-Di",
    "name": "Ham Sliced",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Deli",
    "servingSize": "3 oz",
    "calories": 106,
    "protein": 13.7,
    "carbs": 4.6,
    "fat": 3.0,
    "fiber": 0.0,
    "sugar": 4.6,
    "sodium": 1002.4,
    "allergens": [
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "126378*3-51-Di",
    "name": "Turkey Sliced",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Deli",
    "servingSize": "3 oz",
    "calories": 76,
    "protein": 13.7,
    "carbs": 1.5,
    "fat": 1.5,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 683.4,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "126381*3-51-Di",
    "name": "Chicken Salad",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Deli",
    "servingSize": "3 oz",
    "calories": 207,
    "protein": 13.5,
    "carbs": 4.0,
    "fat": 15.4,
    "fiber": 0.2,
    "sugar": 0.2,
    "sodium": 1076.5,
    "allergens": [
      "eggs"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "019374*2-51-Di",
    "name": "Pullman White Bread Sliced",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Deli",
    "servingSize": "2 slices",
    "calories": 213,
    "protein": 6.4,
    "carbs": 40.5,
    "fat": 2.1,
    "fiber": 2.1,
    "sugar": 2.1,
    "sodium": 447.3,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "080259*4-51-Di",
    "name": "Chicken Philly Meat",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Hot Sub",
    "servingSize": "4 oz",
    "calories": 125,
    "protein": 26.3,
    "carbs": 0.0,
    "fat": 1.4,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 74.0,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": []
  },
  {
    "id": "019377*1-51-Di",
    "name": "Hoagie Roll White",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Hot Sub",
    "servingSize": "1 each",
    "calories": 229,
    "protein": 8.4,
    "carbs": 45.8,
    "fat": 1.8,
    "fiber": 1.2,
    "sugar": 2.4,
    "sodium": 457.6,
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "220110*1-51-Di",
    "name": "Spicy Brown Mustard",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Hot Sub",
    "servingSize": "1 oz",
    "calories": 148,
    "protein": 7.9,
    "carbs": 11.0,
    "fat": 9.1,
    "fiber": 4.6,
    "sugar": 2.1,
    "sodium": 1.6,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "220082*1-51-Di",
    "name": "American Cheese Sliced",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Hot Sub",
    "servingSize": "1 each",
    "calories": 56,
    "protein": 3.0,
    "carbs": 0.5,
    "fat": 4.6,
    "fiber": 0.0,
    "sugar": 0.0,
    "sodium": 182.3,
    "allergens": [
      "dairy",
      "soy"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegetarian"
    ]
  },
  {
    "id": "150180*1-51-Di",
    "name": "Tabasco Onions",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Hot Sub",
    "servingSize": "1 oz",
    "calories": 80,
    "protein": 2.4,
    "carbs": 16.9,
    "fat": 0.3,
    "fiber": 0.9,
    "sugar": 1.7,
    "sodium": 30.4,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "150319*1-51-Di",
    "name": "Grilled Mushrooms",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Smash Hot Sub",
    "servingSize": "1 oz",
    "calories": 16,
    "protein": 2.0,
    "carbs": 2.0,
    "fat": 0.3,
    "fiber": 0.7,
    "sugar": 0.0,
    "sodium": 10.1,
    "allergens": [],
    "allergenDataPublished": false,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090339*6-51-Di",
    "name": "Beef Chili with Beans",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Soups",
    "servingSize": "6 oz",
    "calories": 233,
    "protein": 14.1,
    "carbs": 19.0,
    "fat": 11.3,
    "fiber": 4.9,
    "sugar": 5.6,
    "sodium": 712.4,
    "allergens": [
      "dairy",
      "pork"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  },
  {
    "id": "090345*6-51-Di",
    "name": "Vegan Southwestern 3 Bean Soup",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Soups",
    "servingSize": "6 oz",
    "calories": 143,
    "protein": 8.3,
    "carbs": 26.6,
    "fat": 0.5,
    "fiber": 6.9,
    "sugar": 4.4,
    "sodium": 544.3,
    "allergens": [
      "gluten"
    ],
    "allergenDataPublished": true,
    "dietaryTags": [
      "vegan",
      "vegetarian"
    ]
  },
  {
    "id": "090368*6-51-Di",
    "name": "New England Clam Chowder",
    "diningHall": "251 North",
    "mealPeriod": "Dinner",
    "station": "Soups",
    "servingSize": "6 oz",
    "calories": 158,
    "protein": 4.3,
    "carbs": 21.6,
    "fat": 5.8,
    "fiber": 1.4,
    "sugar": 1.4,
    "sodium": 1137.6,
    "allergens": [
      "dairy",
      "gluten",
      "shellfish"
    ],
    "allergenDataPublished": true,
    "dietaryTags": []
  }
];
