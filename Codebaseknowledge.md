# Codebase Knowledge

A quick, simple map of the repo. Each folder has a one-line purpose, and each file has a very short note on what it does.

## `.firebase/`
Firebase hosting cache and deploy metadata.
- `hosting.ZGlzdA.cache` - hosting cache used by Firebase deploys.

## `dev-dist/`
Generated PWA/service-worker build files for the app.
- `registerSW.js` - registers the service worker.
- `sw.js` - generated service worker bundle.
- `workbox-0957d8d2.js` - Workbox runtime used by the service worker.

## `kisansaathi/`
Nested app snapshot with its own small build output and a few source files.
- `package.json` - package manifest for the nested app.

### `kisansaathi/dev-dist/`
Generated service-worker output for the nested app.
- `sw.js` - nested app service worker.

### `kisansaathi/src/assets/`
Banner images used in the nested home screen.
- `crop-disease-banner.png` - crop disease promo image.
- `govt-schemes-banner.png` - government schemes promo image.
- `market-banner.png` - market promo image.
- `weather-banner.png` - weather promo image.

### `kisansaathi/src/components/shared/`
Shared UI pieces for the nested app.
- `BannerCarousel.tsx` - rotating banner component.

### `kisansaathi/src/pages/home/`
Home screen for the nested app.
- `Home.tsx` - nested app landing page.

## `public/`
Static files served directly by Vite/Firebase, including locale JSON and images.

### `public/assets/images/farm-rental/`
Images for farm rental categories.
- `drone.png` - drone rental image.
- `harvester.png` - harvester rental image.
- `irrigation.png` - irrigation rental image.
- `labor.png` - labor service image.
- `tractor.png` - tractor rental image.
- `transport.png` - transport service image.

### `public/locales/`
Runtime translation files loaded from the public folder.

#### `public/locales/bn/`
Bengali translations.
- `translation.json` - Bengali text strings.

#### `public/locales/en/`
English translations.
- `translation.json` - English text strings.

#### `public/locales/gu/`
Gujarati translations.
- `translation.json` - Gujarati text strings.

#### `public/locales/hi/`
Hindi translations.
- `translation.json` - Hindi text strings.

#### `public/locales/kn/`
Kannada translations.
- `translation.json` - Kannada text strings.

#### `public/locales/mr/`
Marathi translations.
- `translation.json` - Marathi text strings.

#### `public/locales/pa/`
Punjabi translations.
- `translation.json` - Punjabi text strings.

#### `public/locales/ta/`
Tamil translations.
- `translation.json` - Tamil text strings.

#### `public/locales/te/`
Telugu translations.
- `translation.json` - Telugu text strings.

- `farmer-illustration.png` - farmer illustration used in UI.
- `favicon.svg` - browser tab icon.
- `icons.svg` - app icon set.
- `manifest.webmanifest` - PWA manifest.
- `offline.html` - offline fallback page.

## `scripts/`
Utility scripts for repo maintenance.
- `generate-codebase-tree.ps1` - regenerates `CODEBASE_TREE.md`.
- `security-audit.mjs` - runs a security-oriented audit script.

## `src/`
Main React application source code.

### `src/assets/`
App images and branding assets used inside React pages.
- `crop-disease-banner.png` - crop disease banner image.
- `govt-schemes-banner.png` - schemes banner image.
- `hero.png` - main hero artwork.
- `market-banner.png` - market banner image.
- `react.svg` - React logo asset.
- `vite.svg` - Vite logo asset.
- `weather-banner.png` - weather banner image.

### `src/components/layout/`
App shell and navigation layout components.
- `AppShell.tsx` - main app wrapper layout.
- `BottomNav.tsx` - bottom navigation bar.
- `GlobalHeader.tsx` - top header shared across screens.
- `PageTransition.tsx` - page transition wrapper.
- `TopBar.tsx` - compact top app bar.

### `src/components/shared/`
Reusable widgets shared across multiple pages.
- `AlertBanner.tsx` - alert/promo banner block.
- `BannerCarousel.tsx` - rotating banner slider.
- `FarmingCategorySelector.tsx` - category picker for farming flows.
- `FarmLocationMap.tsx` - map view for farm location.
- `MarketPriceCard.tsx` - market price summary card.
- `WeatherWidget.tsx` - weather summary widget.

### `src/components/ui/`
Base UI controls and small building blocks.
- `Badge.tsx` - small label chip.
- `Button.tsx` - reusable button style.
- `Card.tsx` - card container component.
- `FAB.tsx` - floating action button.
- `OfflineBanner.tsx` - offline status banner.
- `Skeleton.tsx` - loading placeholder.
- `VoiceInputButton.tsx` - voice input trigger button.
- `VoiceOrb.tsx` - voice assistant orb UI.

### `src/config/`
Environment and runtime config helpers.
- `env.ts` - reads env values and feature flags.

### `src/hooks/`
Custom hooks for data fetching and app features.
- `useFarmRental.ts` - farm rental data hook.
- `useGemini.ts` - Gemini AI integration hook.
- `useGeolocation.ts` - location access hook.
- `useHomeInsights.ts` - home page insight generator hook.
- `useOfflineSync.ts` - offline sync helper hook.
- `useVoiceAgent.ts` - voice assistant orchestration hook.
- `useVoiceInput.ts` - speech input hook.
- `useWeather.ts` - weather data hook.

### `src/i18n/`
Internationalization setup and language metadata.
- `index.ts` - i18n entry setup.
- `languages.ts` - supported language list.
- `react-i18next.d.ts` - type definitions for i18n.
- `schema.ts` - translation schema/types.

### `src/i18n/locales/`
Bundled translations used by the app.
- `bn.json` - Bengali strings.
- `en.json` - English strings.
- `hi.json` - Hindi strings.
- `kn.json` - Kannada strings.
- `pa.json` - Punjabi strings.
- `ta.json` - Tamil strings.

### `src/pages/auth/`
Authentication and profile screens.
- `Login.tsx` - sign-in screen.
- `Profile.tsx` - farmer profile screen.

### `src/pages/community/`
Community discussion and assistant screens.
- `Forum.tsx` - farmer forum page.
- `SarpanchGPT.tsx` - AI assistant/chat page.

### `src/pages/crop/`
Crop-focused advice, alerts, and market pages.
- `CommunityIntel.tsx` - community intel feed.
- `CropAdvisory.tsx` - crop guidance screen.
- `CropHome.tsx` - crop module home page.
- `HyperlocalAlerts.tsx` - local alert screen.
- `MarketPrices.tsx` - crop price screen.
- `SchemesBenefits.tsx` - scheme and benefit screen.
- `SoilHealth.tsx` - soil health guidance.
- `SupplyChain.tsx` - crop supply chain view.
- `WeatherAlerts.tsx` - weather alert page.

### `src/pages/farm-rental/`
Farm equipment and service rental screens.
- `BookingModal.tsx` - rental booking popup.
- `FarmEquipmentCard.tsx` - equipment card UI.
- `FarmRentalCategory.tsx` - category listing page.
- `FarmRentalCategoryCard.tsx` - category card UI.
- `farmRentalData.ts` - farm rental data source.
- `FarmRentalHome.tsx` - farm rental home page.
- `FarmServiceCard.tsx` - service card UI.
- `MyActivityOverlay.tsx` - user activity overlay.
- `ServiceDetail.tsx` - service details page.

### `src/pages/fields/`
Field and crop planning screens.
- `AddCrop.tsx` - add crop screen.
- `FieldManagement.tsx` - field management page.
- `MyTasks.tsx` - daily task list page.

### `src/pages/fishery/`
Fishery tools and water monitoring screens.
- `AquaMarket.tsx` - aquaculture market page.
- `FisheryHome.tsx` - fishery home page.
- `PondMonitor.tsx` - pond monitoring page.
- `SeaWeather.tsx` - sea weather page.
- `WaterQuality.tsx` - water quality page.

### `src/pages/home/`
Main landing page for the app.
- `Home.tsx` - primary dashboard/home screen.

### `src/pages/livestock/`
Livestock management and support screens.
- `AnimalHealthLog.tsx` - animal health log.
- `FeedCalculator.tsx` - feed planning calculator.
- `InsuranceClaims.tsx` - insurance claim screen.
- `LivestockHome.tsx` - livestock module home page.
- `MandiBhav.tsx` - livestock market rates page.
- `MilkYieldTracker.tsx` - milk yield tracking page.
- `VetConnect.tsx` - vet contact and support page.

### `src/pages/market/`
General marketplace area.
- `Marketplace.tsx` - marketplace screen.

### `src/pages/poultry/`
Poultry management screens.
- `DiseaseScanner.tsx` - poultry disease scanner.
- `EggLog.tsx` - egg production log.
- `FeedInventory.tsx` - feed inventory page.
- `FlockDiary.tsx` - flock diary page.
- `PoultryHome.tsx` - poultry home page.
- `PoultryMarket.tsx` - poultry market page.

### `src/pages/scanner/`
Plant and crop scanning screens.
- `CropScanner.tsx` - crop/leaf scanner page.

### `src/pages/settings/`
App settings screen.
- `Settings.tsx` - user settings page.

### `src/pages/splash/`
First-run onboarding screens.
- `CategorySelect.tsx` - category selection screen.
- `LanguageSelect.tsx` - language selection screen.
- `SplashScreen.tsx` - startup splash screen.

### `src/pages/tools/`
Small decision-support tools.
- `KhetiKharcha.tsx` - farming cost/profit tool.
- `SaudaSuraksha.tsx` - deal safety checker.

### `src/router/`
Route definitions for the whole app.
- `index.tsx` - main router setup.

### `src/services/`
API clients, notifications, and platform integrations.
- `api.ts` - shared API helper.
- `ai.ts` - AI helper layer.
- `mandi.ts` - mandi price service.
- `marketService.ts` - market data service.
- `messagingService.ts` - message delivery helper.
- `notificationService.ts` - push notification setup.
- `weatherService.ts` - weather API service.

### `src/services/firebase/`
Firebase integration helpers.
- `authService.ts` - Firebase auth helpers.
- `firebaseConfig.ts` - Firebase app config.
- `firestoreService.ts` - Firestore read/write helpers.
- `storageService.ts` - Firebase storage helpers.

### `src/services/gemini/`
Gemini AI client code.
- `geminiClient.ts` - Gemini API client.

### `src/services/scanner/`
Leaf and plant scanning helpers.
- `mobilenetLeaf.ts` - MobileNet-based leaf detection.
- `plantnetClient.ts` - PlantNet API client.

### `src/store/`
Zustand stores for app state.
- `useAlertStore.ts` - alert state store.
- `useAppStore.ts` - global app state store.
- `useAuthStore.ts` - auth/profile store.
- `useCategoryStore.ts` - category selection store.
- `useFarmRentalStore.ts` - farm rental state store.
- `useLanguageStore.ts` - language state store.
- `useLocationStore.ts` - location state store.
- `useMarketStore.ts` - market state store.
- `useTodaysPlanStore.ts` - today's plan store.
- `useWeatherStore.ts` - weather state store.

### `src/types/`
Shared TypeScript type definitions.
- `crop.ts` - crop-related types.
- `farmer.ts` - farmer/profile types.
- `fishery.ts` - fishery types.
- `leafScanner.ts` - leaf scanner types.
- `livestock.ts` - livestock types.
- `poultry.ts` - poultry types.
- `speech-recognition.d.ts` - speech recognition type shim.

### `src/utils/`
Small helper functions used across the app.
- `colorSystem.ts` - shared color utilities.
- `cropCalendar.ts` - crop calendar helper.
- `dateHelper.ts` - date formatting helper.
- `leafScannerPdf.ts` - PDF report helper for scanning.
- `offline.ts` - offline-related helpers.
- `unitConverter.ts` - unit conversion helper.

- `App.css` - app-level styles.
- `App.tsx` - top-level app component.
- `index.css` - global CSS baseline.
- `main.tsx` - React entry point.

## Root files
Project config, docs, and build setup.
- `.env.example` - sample environment variables.
- `.firebaserc` - Firebase project config.
- `.gitignore` - ignored files list.
- `AGENTS.md` - agent workspace instructions.
- `CODEBASE_TREE.md` - generated repository tree.
- `eslint.config.js` - ESLint config.
- `final_implementations.md` - implementation notes/doc.
- `firebase.json` - Firebase hosting config.
- `firestore.rules` - Firestore security rules.
- `index.html` - Vite app entry HTML.
- `instructions__1_.md` - extra repo instructions note.
- `package.json` - root package manifest.
- `package-lock.json` - locked dependency tree.
- `postcss.config.js` - PostCSS config.
- `README.md` - project overview and setup.
- `storage.rules` - Firebase Storage security rules.
- `tailwind.config.ts` - Tailwind config.
- `tsconfig.app.json` - TypeScript app config.
- `tsconfig.json` - base TypeScript config.
- `tsconfig.node.json` - TypeScript config for node files.
- `vite.config.ts` - Vite build config.
