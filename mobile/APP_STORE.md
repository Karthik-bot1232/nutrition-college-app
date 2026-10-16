# App Store submission: Campus Cals

Everything App Store Connect asks for, ready to paste. Fields are within
Apple's length limits.

## Before the first build

1. Push this repo to GitHub. Render deploys from it.
2. Render: **New → Blueprint**, pick the repo, paste `DATABASE_URL`. Then open
   `https://campus-cals.onrender.com/api/colleges` and check that University of
   Maryland is listed.
   - If Render gave a different URL, change `EXPO_PUBLIC_API_URL` in
     `eas.json`. Also set the GitHub repository variable `APP_URL`, which the
     keep-warm workflow uses.
3. GitHub → Settings → Secrets and variables → Actions:
   - add secret `DATABASE_URL` (used by the daily menu refresh).
4. Check that `https://campus-cals.onrender.com/privacy.html` and `/support.html`
   load. They are the Privacy Policy URL and Support URL below.

## Build and upload (from `mobile/`)

```bash
npx eas-cli@latest login
npx eas-cli@latest init                      # links the project, writes its id into app.json
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios --latest
```

The build asks to sign in to Apple and creates the bundle id
`com.karthikvunnava.campuscals`, certificates and profiles. Let it. Submit
creates the App Store Connect record if there is none. The build then appears
in TestFlight after Apple finishes processing it (about 10–30 minutes).
Install it from TestFlight and try every tab, especially Scan with a real
photo.

## App information

| Field | Value |
| --- | --- |
| Name | Campus Cals |
| Subtitle | Dining hall menus & nutrition |
| Primary category | Health & Fitness |
| Secondary category | Food & Drink |
| Content rights | Does not contain third-party content that requires rights. Menus are factual public information; the app shows no university logos. |
| Age rating | 4+ (answer "None" to every question) |
| Price | Free |

## Privacy

- **Privacy Policy URL:** https://campus-cals.onrender.com/privacy.html
- **App Privacy → Data collection:** "No, we do not collect data from this app."
  Everything personal stays on the device. Requests to the menu server carry no
  identifiers and are not stored with anything about the user.

## Version 1.0

**Support URL:** https://campus-cals.onrender.com/support.html

**Promotional text** (170 max)

> See what every dining hall is serving right now, with the full nutrition label for each dish. Find high-protein picks, skip your allergens, and log meals in a tap.

**Keywords** (100 max)

```
dining hall,menu,nutrition,calories,protein,macros,college,campus,meal planner,food log,allergen
```

**Description**

> Campus Cals puts your dining hall's menu and the full nutrition label for every dish in your pocket.
>
> WHAT'S OPEN NOW
> See which dining halls are serving right now and until when, and jump straight to the meal being served.
>
> EVERY LABEL, EVERY DISH
> Calories, protein, carbs and fat at a glance, plus the full nutrition facts with % Daily Value, ingredients and allergens for every item on the menu.
>
> FOOD THAT FITS YOU
> Set your diet (vegan, vegetarian, halal) and the allergens you avoid once. Menus, searches and picks respect them everywhere. Items whose hall published no allergen information are never shown as allergen-free.
>
> SCAN A NAME CARD
> Point your camera at the card in front of a dish and Campus Cals finds it on today's menu and opens its label. The photo is read on your phone and never uploaded.
>
> BUILD A MEAL
> Tell it your calorie and protein target and it puts together plates from what is actually being served today.
>
> TRACK YOUR DAY
> Log meals by the serving, ounce or gram, see your calories and protein against your daily targets, track water, and see your week at a glance.
>
> FAVORITES
> Heart the dishes you love and the Today screen tells you when they're on.
>
> PRIVATE BY DESIGN
> No account and no sign-up. Your settings, favorites and meal log stay on your phone, and nothing is tracked.
>
> Campus Cals currently supports the University of Maryland, with more campuses coming. Menus and nutrition information come from each campus's public dining website and may differ from what is served. Campus Cals is independent and not affiliated with any university.

**What's new in this version:** First release.

**Copyright:** 2026 Campus Cals

## Screenshots

Required: 6.9" iPhone (1320 × 2868). Apple scales them down for smaller
iPhones. Take them on an iPhone 16/17 Pro Max (or the largest you have) from
the TestFlight build with side button + volume up. Use 3–6, in this order:

1. Today: halls open now and the protein picks
2. Menu: a station list with cards
3. An item's nutrition label sheet
4. Build: an Option card hitting the target
5. Tracker: the calorie ring and a logged meal
6. Scan: a matched name card

The app is iPhone-only (`supportsTablet: false`), so iPad screenshots are not
needed.

## App Review information

- **Sign-in required:** No.
- **Notes:**

> Campus Cals needs no account. On first launch choose "University of Maryland", then optionally enter a name, diet and targets (or tap Skip).
>
> The Scan tab reads the name card posted in front of a dish in a university dining hall. Without one, tap "Choose from photos" with any photo, or type a dish name such as "Fresh Turkey Burger" into the text field that appears and tap "Find this".
>
> Menu and nutrition data are public information published by the university's dining website and refreshed daily. The app is independent and not affiliated with the university. All personal data stays on the device; "You → Erase all my data" deletes it.

## After approval

- Choose manual or automatic release.
- For later versions, run `eas build` + `eas submit` again; the build number
  increments on its own (`autoIncrement` in `eas.json`).
