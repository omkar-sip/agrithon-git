# Codebase Knowledge

This file is a quick map of the repo so anyone can understand what each folder and file is for in a few seconds.

## Root

- `.firebase/`: Firebase hosting cache and deployment metadata.
  - `hosting.ZGlzdA.cache`: Firebase hosting cache file.

- `dev-dist/`: Local generated service worker build output.
  - `registerSW.js`: Registers the PWA service worker.
  - `sw.js`: Generated service worker file.
  - `workbox-0957d8d2.js`: Workbox runtime used by the service worker.

- `kisansaathi/`: Smaller parallel/demo app copy kept inside the repo.
  - `dev-dist/`: Generated service worker output for the nested app.
    - `sw.js`: Nested app service worker file.
  - `src/`: Source files for the nested app.
    - `assets/`: Banner images used in the nested app.
      - `crop-disease-banner.png`: Crop disease banner image.
      - `govt-schemes-banner.png`: Government schemes banner image.
      - `market-banner.png`: Market banner image.
      - `weather-banner.png`: Weather banner image.
    - `components/`: Reusable nested app UI pieces.
      - `shared/`: Shared display components.
        - `BannerCarousel.tsx`: Rotating banner slider for the nested home page.
    - `pages/`: Nested app screens.
      - `home/`: Nested home screen.
        - `Home.tsx`: Nested app dashboard page.
  - `package.json`: Package file for the nested app.

- `public/`: Static files served directly by Vite.
  - `assets/`: Static public assets.
    - `images/`: Public images.
      - `farm-rental/`: Images for farm rental categories.
        - `drone.png`: Drone category image.
        - `harvester.png`: Harvester category image.
        - `irrigation.png`: Irrigation category image.
        - `labor.png`: Labor category image.
        - `tractor.png`: Tractor category image.
        - `transport.png`: Transport category image.
  - `locales/`: Public translation files used by language selection.
    - `bn/`: Bengali public translations.
      - `translation.json`: Bengali translation strings.
    - `en/`: English public translations.
      - `translation.json`: English translation strings.
    - `gu/`: Gujarati public translations.
      - `translation.json`: Gujarati translation strings.
    - `hi/`: Hindi public translations.
      - `translation.json`: Hindi translation strings.
    - `kn/`: Kannada public translations.
      - `translation.json`: Kannada translation strings.
    - `mr/`: Marathi public translations.
      - `translation.json`: Marathi translation strings.
    - `pa/`: Punjabi public translations.
      - `translation.json`: Punjabi translation strings.
    - `ta/`: Tamil public translations.
      - `translation.json`: Tamil translation strings.
    - `te/`: Telugu public translations.
      - `translation.json`: Telugu translation strings.
  - `farmer-illustration.png`: Main farmer illustration asset.
  - `favicon.svg`: Browser tab icon.
  - `icons.svg`: Shared icon sprite/static icon asset.
  - `manifest.webmanifest`: PWA manifest.
  - `offline.html`: Offline fallback page.

- `scripts/`: Small maintenance scripts for the repo.
  - `generate-codebase-tree.ps1`: Regenerates the codebase tree index.
  - `security-audit.mjs`: Runs a lightweight security audit check.

- `src/`: Main application source code.

## `src/assets`

- `assets/`: Main app image assets.
  - `crop-disease-banner.png`: Crop disease scanner banner.
  - `govt-schemes-banner.png`: Government schemes banner.
  - `hero.png`: Main hero/branding image.
  - `market-banner.png`: Marketplace banner.
  - `react.svg`: Default React asset.
  - `vite.svg`: Default Vite asset.
  - `weather-banner.png`: Weather feature banner.

## `src/components`

- `components/`: Reusable UI building blocks.

### `src/components/layout`

- `AppShell.tsx`: Shared app shell with header, outlet, bottom nav, and FAB.
- `BottomNav.tsx`: Bottom navigation bar for main sections.
- `GlobalHeader.tsx`: Top header with profile, actions, and slide-out menu.
- `PageTransition.tsx`: Shared page entry/exit animation wrapper.
- `TopBar.tsx`: Additional top bar layout helper.

### `src/components/shared`

- `AlertBanner.tsx`: Reusable alert/information banner.
- `BannerCarousel.tsx`: Rotating image carousel used on dashboard/home.
- `FarmingCategorySelector.tsx`: Selector for farmer category choices.
- `FarmLocationMap.tsx`: Map view for farm/location display.
- `MarketPriceCard.tsx`: Card used to show market price snapshots.
- `WeatherWidget.tsx`: Shared weather summary card.

### `src/components/ui`

- `Badge.tsx`: Small badge/pill component.
- `Button.tsx`: Reusable button component.
- `Card.tsx`: Reusable card container.
- `FAB.tsx`: Floating action button, mainly for chat/assistant access.
- `OfflineBanner.tsx`: Banner shown when network is offline.
- `Skeleton.tsx`: Loading placeholder component.
- `VoiceInputButton.tsx`: Button that triggers voice input.
- `VoiceOrb.tsx`: Animated orb used in voice interactions.

## `src/config`

- `env.ts`: Reads environment variables and exposes API availability flags.

## `src/hooks`

- `useFarmRental.ts`: Hook for farm rental filtering, booking, favorites, and local state.
- `useGemini.ts`: Hook wrapper for Gemini-powered text generation.
- `useGeolocation.ts`: Hook for browser geolocation access.
- `useHomeInsights.ts`: Hook that prepares home dashboard market/AI insights.
- `useOfflineSync.ts`: Hook for offline sync behavior.
- `useVoiceAgent.ts`: Hook for voice assistant orchestration.
- `useVoiceInput.ts`: Hook for speech input handling.
- `useWeather.ts`: Hook that reads and formats weather state.

## `src/i18n`

- `i18n/`: Internationalization setup and language data.
  - `locales/`: App-side locale JSON files.
    - `bn.json`: Bengali app translations.
    - `en.json`: English app translations.
    - `hi.json`: Hindi app translations.
    - `kn.json`: Kannada app translations.
    - `pa.json`: Punjabi app translations.
    - `ta.json`: Tamil app translations.
  - `index.ts`: Initializes i18next for the app.
  - `languages.ts`: Supported language list and helpers.
  - `react-i18next.d.ts`: Type support for react-i18next.
  - `schema.ts`: Translation key schema/reference typing.

## `src/pages`

- `pages/`: All route screens in the app.

### `src/pages/auth`

- `Login.tsx`: Login/signup screen for email, phone, and Google auth.
- `Profile.tsx`: Farmer profile completion and account details screen.

### `src/pages/community`

- `Forum.tsx`: Community discussion/forum screen.
- `SarpanchGPT.tsx`: Voice/text AI farm assistant chat screen.

### `src/pages/crop`

- `CommunityIntel.tsx`: Community crop reports and local field intelligence.
- `CropAdvisory.tsx`: Fasal Salah advisory page using weather, soil, and AI.
- `CropHome.tsx`: Crop module landing page.
- `HyperlocalAlerts.tsx`: Hyperlocal alerts and important local signals.
- `MarketPrices.tsx`: Crop market prices and alerts page.
- `SchemesBenefits.tsx`: Government schemes and benefits page.
- `SoilHealth.tsx`: Mitti Sehat soil guidance page.
- `SupplyChain.tsx`: Crop supply chain and logistics related page.
- `WeatherAlerts.tsx`: Crop weather alerts and forecast details page.

### `src/pages/farm-rental`

- `BookingModal.tsx`: Booking modal for renting services/equipment.
- `FarmEquipmentCard.tsx`: Card for a single equipment/service item.
- `FarmRentalCategory.tsx`: Category-level farm rental listing page.
- `FarmRentalCategoryCard.tsx`: Card for a rental category.
- `farmRentalData.ts`: Static data for farm rental categories and items.
- `FarmRentalHome.tsx`: Main equipment rental landing page.
- `FarmServiceCard.tsx`: Detailed service card used in rental listings.
- `MyActivityOverlay.tsx`: Overlay for favorites, bookings, and user activity.
- `ServiceDetail.tsx`: Detailed page for one rental service.

### `src/pages/fields`

- `AddCrop.tsx`: Add a crop to field management.
- `FieldManagement.tsx`: Main field management dashboard.
- `MyTasks.tsx`: Task list and daily work planner for fields.

### `src/pages/fishery`

- `AquaMarket.tsx`: Fishery market page.
- `FisheryHome.tsx`: Fishery module landing page.
- `PondMonitor.tsx`: Pond monitoring dashboard.
- `SeaWeather.tsx`: Sea and fishery weather page.
- `WaterQuality.tsx`: Water quality tracking page.

### `src/pages/home`

- `Home.tsx`: Main app dashboard/home screen.

### `src/pages/livestock`

- `AnimalHealthLog.tsx`: Logbook for livestock health updates.
- `FeedCalculator.tsx`: Feed calculation helper for livestock.
- `InsuranceClaims.tsx`: Livestock insurance/claims page.
- `LivestockHome.tsx`: Livestock module landing page.
- `MandiBhav.tsx`: Livestock mandi price page.
- `MilkYieldTracker.tsx`: Milk production tracking page.
- `VetConnect.tsx`: Veterinary help/contact page.

### `src/pages/market`

- `Marketplace.tsx`: Main marketplace page for buying/selling and prices.

### `src/pages/poultry`

- `DiseaseScanner.tsx`: Poultry disease scanning page.
- `EggLog.tsx`: Egg production tracking page.
- `FeedInventory.tsx`: Poultry feed stock tracking page.
- `FlockDiary.tsx`: Flock management diary page.
- `PoultryHome.tsx`: Poultry module landing page.
- `PoultryMarket.tsx`: Poultry market page.

### `src/pages/scanner`

- `CropScanner.tsx`: Leaf disease scanner page with image upload, AI analysis, and PDF download.

### `src/pages/settings`

- `Settings.tsx`: App settings page.

### `src/pages/splash`

- `CategorySelect.tsx`: Category selection during onboarding.
- `LanguageSelect.tsx`: Language selection during onboarding.
- `SplashScreen.tsx`: Initial splash/loading screen.

### `src/pages/tools`

- `KhetiKharcha.tsx`: Farm budget and profit estimation tool.
- `SaudaSuraksha.tsx`: Contract risk checker tool.

## `src/router`

- `index.tsx`: Central React Router route map for the whole app.

## `src/services`

- `services/`: Data services, API wrappers, AI logic, and integrations.
  - `firebase/`: Firebase auth, storage, and Firestore helpers.
    - `authService.ts`: Firebase authentication helpers.
    - `firebaseConfig.ts`: Firebase app initialization and exports.
    - `firestoreService.ts`: Firestore reads/writes for profiles and app data.
    - `storageService.ts`: Firebase Storage upload helpers.
  - `gemini/`: Gemini integration logic.
    - `geminiClient.ts`: Main Gemini client with prompts, parsing, and AI features.
  - `scanner/`: Leaf scanner helper services.
    - `mobilenetLeaf.ts`: On-device leaf validation using MobileNet.
    - `plantnetClient.ts`: PlantNet API integration for plant identification.
  - `ai.ts`: Shared AI helper methods for tool pages.
  - `api.ts`: General API utility layer.
  - `locationService.ts`: Location lookup and location helper methods.
  - `mandi.ts`: Mandi/market data fetching helpers.
  - `marketService.ts`: Market data service wrappers.
  - `messagingService.ts`: Messaging/SMS related service helpers.
  - `notificationService.ts`: Push/local notification setup and helpers.
  - `weatherService.ts`: Weather API service and formatting logic.

## `src/store`

- `store/`: Zustand stores for global app state.
  - `useAlertStore.ts`: Alert and notification state.
  - `useAppStore.ts`: Core app state like online/offline status.
  - `useAuthStore.ts`: Authentication and farmer session state.
  - `useCategoryStore.ts`: Farmer category selection state.
  - `useFarmRentalStore.ts`: Farm rental state and local persistence.
  - `useLanguageStore.ts`: Selected language state and persistence.
  - `useLocationStore.ts`: Farmer/location state.
  - `useMarketStore.ts`: Market-related global state.
  - `useTodaysPlanStore.ts`: Daily plan/task state.
  - `useWeatherStore.ts`: Weather data state and advisory helpers.

## `src/types`

- `types/`: Shared TypeScript types and interfaces.
  - `crop.ts`: Crop-related types.
  - `cropAdvisory.ts`: Crop advisory result and card types.
  - `farmer.ts`: Farmer profile/data types.
  - `fishery.ts`: Fishery-related types.
  - `leafScanner.ts`: Leaf scanner analysis and treatment types.
  - `livestock.ts`: Livestock-related types.
  - `poultry.ts`: Poultry-related types.
  - `speech-recognition.d.ts`: Browser speech recognition type declarations.

## `src/utils`

- `utils/`: Small helpers and formatters used across the app.
  - `colorSystem.ts`: Shared color utility values/helpers.
  - `cropCalendar.ts`: Crop season/calendar helper data.
  - `dateHelper.ts`: Date formatting and date helper functions.
  - `leafScannerPdf.ts`: PDF report generator for the leaf scanner.
  - `offline.ts`: Offline mode utility helpers.
  - `unitConverter.ts`: Unit conversion helpers.

## Main `src` files

- `App.css`: Extra app-level CSS.
- `App.tsx`: Top-level app component, bootstraps stores, auth sync, router, and toaster.
- `index.css`: Global Tailwind-based styling and design system classes.
- `main.tsx`: React entry point and browser bootstrapping.

## Root config and docs files

- `.env.example`: Example environment variable file.
- `.firebaserc`: Firebase project alias/config file.
- `.gitignore`: Git ignore rules.
- `AGENTS.md`: Workspace instructions for coding agents.
- `CODEBASE_TREE.md`: Tree view of the repo structure.
- `eslint.config.js`: ESLint configuration.
- `final_implementations.md`: Notes or summary of completed implementations.
- `firebase.json`: Firebase hosting/project config.
- `firestore.rules`: Firestore security rules.
- `index.html`: Vite HTML entry file.
- `instructions__1_.md`: Extra project instruction/reference file.
- `package.json`: App scripts, dependencies, and package metadata.
- `package-lock.json`: Exact npm dependency lockfile.
- `postcss.config.js`: PostCSS configuration.
- `README.md`: Main project readme.
- `storage.rules`: Firebase Storage security rules.
- `tailwind.config.ts`: Tailwind theme and plugin config.
- `tsconfig.app.json`: TypeScript config for app code.
- `tsconfig.json`: Base TypeScript config.
- `tsconfig.node.json`: TypeScript config for Node/Vite files.
- `vite.config.ts`: Vite config, dev proxy, and PWA setup.
