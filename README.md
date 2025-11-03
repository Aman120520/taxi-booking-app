## JunnoExpress — Taxi Booking App (React Native)

Cross‑platform taxi booking app built with React Native. It includes authentication, rider and driver flows, intercity/intracity rides, bookings, payments, notifications, and localization. This repository is sanitized for public sharing; see the notice below to configure your own keys.

### Features
- **Authentication**: Email/phone sign‑in, social auth (Google/Apple/Facebook)
- **Rider & Driver modes**: Switch profiles and manage rides
- **Intracity & Intercity**: Search, plan, and book rides
- **Maps & Routing**: Location picker, directions, ETA (Google Maps)
- **Payments**: Stripe integration for secure payments
- **Notifications**: Push notifications and crash reporting (Firebase)
- **Localization**: Multi‑language with `i18next`
- **Theming & Assets**: Custom fonts and rich assets

### Tech Stack
- React Native 0.73, React 18
- Navigation: `@react-navigation/*`
- State: `@reduxjs/toolkit`, `react-redux`, `redux-thunk`
- Payments: `@stripe/stripe-react-native`
- Maps: `react-native-maps`
- Push/crash: `@react-native-firebase/*`, `@notifee/react-native`
- i18n: `i18next`, `react-i18next`
- UI/UX: Reanimated, gesture handler, image picker, calendars, etc.

---

## Sanitized Sample Code Notice

This repository has been sanitized for sharing as a sample. Sensitive files and keys have been removed and replaced with placeholders.

Provide your configuration in `App/Network/Constant.js`:
- `BASE_URl`: `https://YOUR_API_BASE_URL/`
- `PUBLISH_KEY`: `YOUR_STRIPE_PUBLISHABLE_KEY`
- `VEIFY_IDENTITY_TEMPLATE_ID`: `YOUR_VERIFY_IDENTITY_TEMPLATE_ID`
- `RESERVE_URL`: `https://YOUR_API_BASE_URL/authentication/login`
- `PLACES_API_TOKEN`: `YOUR_PLACES_API_TOKEN`
- `DIRECTIONS_API_TOKEN`: `YOUR_DIRECTIONS_API_TOKEN`

Removed platform secret files:
- `android/app/google-services.json`
- `android/app/debug.keystore`
- `android/app/JunnoExpress.jks`
- `android/local.properties`
- `ios/GoogleService-Info.plist`

Do not commit real secrets to version control.

---

## Requirements
- Node.js >= 18
- React Native environment setup (Xcode for iOS, Android Studio/SDKs for Android)
- CocoaPods (macOS): `brew install cocoapods`

## Quick Start
1. Install dependencies

```bash
npm install
# or
yarn
```

2. iOS pods

```bash
cd ios && pod install && cd ..
```

3. Configure secrets (see Sanitized Notice) by editing `App/Network/Constant.js` and placing the platform files:
   - Android: `android/app/google-services.json`
   - iOS: `ios/GoogleService-Info.plist`

4. Run Metro (in one terminal)

```bash
npm start
# or
yarn start
```

5. Run the app (in another terminal)

```bash
# Android
npm run android
# iOS
npm run ios
```

## Scripts
- `npm start`: Start Metro bundler
- `npm run android`: Build and run Android
- `npm run ios`: Build and run iOS
- `npm test`: Run Jest tests
- `npm run lint`: Lint the codebase

## Configuration
Edit `App/Network/Constant.js` with your real values:
- API base URL and reserve/auth endpoints
- Stripe publishable key
- Google Places & Directions API tokens
- Persona/identity verification template ID (if used)

You may also need to configure native project settings (URL schemes, entitlements, Android manifests) for Google/Apple/Facebook sign‑in, Stripe, Firebase, and maps.

## Project Structure (key paths)
- `App/` — source code
  - `Screens/` — UI screens for Auth, Rider, Driver, etc.
  - `Components/` — reusable UI components
  - `Navigators/` — navigation stacks and tabs
  - `Actions/`, `Reducer/`, `Store/` — state management
  - `Network/` — API and constants
  - `Resources/` — colors, strings, fonts, images, responsive helpers
  - `Helpers/` — utilities and helpers
- `android/`, `ios/` — native projects

## Testing & Linting
```bash
npm test
npm run lint
```

## Troubleshooting
- Ensure the React Native environment is correctly set up: https://reactnative.dev/docs/environment-setup
- Common issues: https://reactnative.dev/docs/troubleshooting
- iOS: run `cd ios && pod install` after adding native dependencies.
- Android: verify SDK/NDK, emulator, and JDK versions compatible with RN 0.73.

## Contributing
Issues and PRs are welcome. Please avoid committing secrets and platform‑specific keys.

## License
This sample is provided without a license for demonstration purposes. Add your preferred license before distributing.


