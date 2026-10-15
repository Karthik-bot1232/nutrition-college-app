# Campus Cals (iOS / Android)

The Expo (React Native) app. It reads the same JSON API as the web front end
(`dining.serve`), and keeps everything personal (campus, favorites, diet
profile, targets, plates, water) on the phone in AsyncStorage. Nothing is
written to the server.

## Each person gets their own app

There are no accounts, and none are needed. All personal data lives in the
app's own storage on the phone, so every install is its own person:

- First launch walks through setup: campus (from `/api/colleges`, so a newly
  onboarded school shows up without an app update), first name, diet and
  allergies, and daily targets. Only the campus is required.
- After that the app opens straight onto that person's setup, greets them by
  name, and keeps their favorites (per campus), targets and meal log.
- **You** (the person icon, top right) edits all of it and has
  **Erase all my data**, which wipes the phone's copy and restarts setup.
- iOS includes this storage in the phone's iCloud/device backup, so it moves to
  a new phone with everything else.

The last campus data and the day's menus are cached on the phone too, so the
app opens instantly and still shows today's menu without signal.

## Run it on your phone

You need the API running on your Mac, reachable over Wi-Fi, and the phone on
the same network:

```bash
# terminal 1, project root: the API, listening on the LAN rather than loopback
HOST=0.0.0.0 ./.venv/bin/python -m dining.serve

# terminal 2
cd mobile
npm install
npm run go          # Expo Go: scan the QR code with the iPhone camera
```

In development the app calls `http://<the Mac's LAN IP>:8000`, the same machine
serving the JavaScript, so nothing needs configuring.

If edits stop showing up, Metro's file watcher has lost track (the space in
this project's path makes it flaky without Watchman). `brew install watchman`
fixes it for good; restarting with `npx expo start --clear` fixes it once.

Expo Go has no text recognition, so **Scan** falls back to typing the name on
the card. Photo reading (Apple Vision / ML Kit, on the phone) works in a
development or store build:

```bash
npx eas-cli@latest build --profile development --platform ios
npm start           # then open the installed dev build
```

## Ship it

The full checklist, with every App Store Connect field written out, is in
[APP_STORE.md](APP_STORE.md). In short:

Builds run in Expo's cloud, so no Xcode is needed. You need an Apple Developer
account ($99/year) and an Expo account.

1. Deploy the API (`render.yaml` at the project root) and check the URL Render
   gave it. If it is not `https://campus-cals.onrender.com`, change
   `EXPO_PUBLIC_API_URL` in `eas.json`.
2. `npx eas-cli@latest build --profile production --platform ios`
   (first run: it logs in, creates the bundle id
   `com.karthikvunnava.campuscals` and the signing certificates for you).
3. `npx eas-cli@latest submit --platform ios --latest` uploads the build to
   App Store Connect. Fill in the listing there and submit it for review.

`preview` builds the same app for internal installs (TestFlight-free testing
on registered devices).

## Code map

- `src/app/` routes. `(tabs)/` is Today, Menu, Scan, Build, Tracker; the other
  files are sheets (item label, filters, hall, targets, favorites, stats,
  campus, settings) and the first-launch setup, `welcome`.
- `src/lib/logic.ts` is ported from `dining/web/app.js`: hours, the diet
  profile, the plate builder and the name-card matcher, as pure functions.
- `src/lib/store.tsx` holds app state and on-phone storage.
- `src/lib/api.ts` is the HTTP client; every call sends the chosen `college`.

```bash
npm run typecheck && npm run lint && npx expo-doctor
```
