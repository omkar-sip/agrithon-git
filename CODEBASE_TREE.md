# Codebase Tree

This file is a lightweight path index to quickly locate code and reduce repeated repository scans.

- Generated: 2026-04-09 08:54:35 +05:30
- Root: F:\Sarpanch AI
- Excluded directories: .git, .tmp, node_modules
- Regenerate: powershell -ExecutionPolicy Bypass -File scripts/generate-codebase-tree.ps1

~~~text
.
|-- .firebase/
|   \-- hosting.ZGlzdA.cache
|-- dev-dist/
|   |-- registerSW.js
|   |-- sw.js
|   \-- workbox-0957d8d2.js
|-- kisansaathi/
|   |-- dev-dist/
|   |   \-- sw.js
|   |-- src/
|   |   |-- assets/
|   |   |   |-- crop-disease-banner.png
|   |   |   |-- govt-schemes-banner.png
|   |   |   |-- market-banner.png
|   |   |   \-- weather-banner.png
|   |   |-- components/
|   |   |   \-- shared/
|   |   |       \-- BannerCarousel.tsx
|   |   \-- pages/
|   |       \-- home/
|   |           \-- Home.tsx
|   \-- package.json
|-- public/
|   |-- assets/
|   |   \-- images/
|   |       \-- farm-rental/
|   |           |-- drone.png
|   |           |-- harvester.png
|   |           |-- irrigation.png
|   |           |-- labor.png
|   |           |-- tractor.png
|   |           \-- transport.png
|   |-- locales/
|   |   |-- bn/
|   |   |   \-- translation.json
|   |   |-- en/
|   |   |   \-- translation.json
|   |   |-- gu/
|   |   |   \-- translation.json
|   |   |-- hi/
|   |   |   \-- translation.json
|   |   |-- kn/
|   |   |   \-- translation.json
|   |   |-- mr/
|   |   |   \-- translation.json
|   |   |-- pa/
|   |   |   \-- translation.json
|   |   |-- ta/
|   |   |   \-- translation.json
|   |   \-- te/
|   |       \-- translation.json
|   |-- farmer-illustration.png
|   |-- favicon.svg
|   |-- icons.svg
|   |-- manifest.webmanifest
|   \-- offline.html
|-- scripts/
|   |-- generate-codebase-tree.ps1
|   \-- security-audit.mjs
|-- src/
|   |-- assets/
|   |   |-- crop-disease-banner.png
|   |   |-- govt-schemes-banner.png
|   |   |-- hero.png
|   |   |-- market-banner.png
|   |   |-- react.svg
|   |   |-- vite.svg
|   |   \-- weather-banner.png
|   |-- components/
|   |   |-- layout/
|   |   |   |-- AppShell.tsx
|   |   |   |-- BottomNav.tsx
|   |   |   |-- GlobalHeader.tsx
|   |   |   |-- PageTransition.tsx
|   |   |   \-- TopBar.tsx
|   |   |-- shared/
|   |   |   |-- AlertBanner.tsx
|   |   |   |-- BannerCarousel.tsx
|   |   |   |-- FarmingCategorySelector.tsx
|   |   |   |-- FarmLocationMap.tsx
|   |   |   |-- MarketPriceCard.tsx
|   |   |   \-- WeatherWidget.tsx
|   |   \-- ui/
|   |       |-- Badge.tsx
|   |       |-- Button.tsx
|   |       |-- Card.tsx
|   |       |-- FAB.tsx
|   |       |-- OfflineBanner.tsx
|   |       |-- Skeleton.tsx
|   |       |-- VoiceInputButton.tsx
|   |       \-- VoiceOrb.tsx
|   |-- config/
|   |   \-- env.ts
|   |-- hooks/
|   |   |-- useFarmRental.ts
|   |   |-- useGemini.ts
|   |   |-- useGeolocation.ts
|   |   |-- useHomeInsights.ts
|   |   |-- useOfflineSync.ts
|   |   |-- useVoiceAgent.ts
|   |   |-- useVoiceInput.ts
|   |   \-- useWeather.ts
|   |-- i18n/
|   |   |-- locales/
|   |   |   |-- bn.json
|   |   |   |-- en.json
|   |   |   |-- hi.json
|   |   |   |-- kn.json
|   |   |   |-- pa.json
|   |   |   \-- ta.json
|   |   |-- index.ts
|   |   |-- languages.ts
|   |   |-- react-i18next.d.ts
|   |   \-- schema.ts
|   |-- pages/
|   |   |-- auth/
|   |   |   |-- Login.tsx
|   |   |   \-- Profile.tsx
|   |   |-- community/
|   |   |   |-- Forum.tsx
|   |   |   \-- SarpanchGPT.tsx
|   |   |-- crop/
|   |   |   |-- CommunityIntel.tsx
|   |   |   |-- CropAdvisory.tsx
|   |   |   |-- CropHome.tsx
|   |   |   |-- GovernmentSchemesRedirect.tsx
|   |   |   |-- HyperlocalAlerts.tsx
|   |   |   |-- MarketPrices.tsx
|   |   |   |-- SchemesBenefits.tsx
|   |   |   |-- SoilHealth.tsx
|   |   |   |-- SupplyChain.tsx
|   |   |   \-- WeatherAlerts.tsx
|   |   |-- farm-rental/
|   |   |   |-- BookingModal.tsx
|   |   |   |-- FarmEquipmentCard.tsx
|   |   |   |-- FarmRentalCategory.tsx
|   |   |   |-- FarmRentalCategoryCard.tsx
|   |   |   |-- farmRentalData.ts
|   |   |   |-- FarmRentalHome.tsx
|   |   |   |-- FarmServiceCard.tsx
|   |   |   |-- MyActivityOverlay.tsx
|   |   |   \-- ServiceDetail.tsx
|   |   |-- fields/
|   |   |   |-- AddCrop.tsx
|   |   |   |-- FieldManagement.tsx
|   |   |   \-- MyTasks.tsx
|   |   |-- fishery/
|   |   |   |-- AquaMarket.tsx
|   |   |   |-- FisheryHome.tsx
|   |   |   |-- PondMonitor.tsx
|   |   |   |-- SeaWeather.tsx
|   |   |   \-- WaterQuality.tsx
|   |   |-- home/
|   |   |   \-- Home.tsx
|   |   |-- livestock/
|   |   |   |-- AnimalHealthLog.tsx
|   |   |   |-- FeedCalculator.tsx
|   |   |   |-- InsuranceClaims.tsx
|   |   |   |-- LivestockHome.tsx
|   |   |   |-- MandiBhav.tsx
|   |   |   |-- MilkYieldTracker.tsx
|   |   |   \-- VetConnect.tsx
|   |   |-- market/
|   |   |   \-- Marketplace.tsx
|   |   |-- poultry/
|   |   |   |-- DiseaseScanner.tsx
|   |   |   |-- EggLog.tsx
|   |   |   |-- FeedInventory.tsx
|   |   |   |-- FlockDiary.tsx
|   |   |   |-- PoultryHome.tsx
|   |   |   \-- PoultryMarket.tsx
|   |   |-- scanner/
|   |   |   \-- CropScanner.tsx
|   |   |-- settings/
|   |   |   \-- Settings.tsx
|   |   |-- splash/
|   |   |   |-- CategorySelect.tsx
|   |   |   |-- LanguageSelect.tsx
|   |   |   \-- SplashScreen.tsx
|   |   \-- tools/
|   |       |-- KhetiKharcha.tsx
|   |       \-- SaudaSuraksha.tsx
|   |-- router/
|   |   \-- index.tsx
|   |-- services/
|   |   |-- firebase/
|   |   |   |-- authService.ts
|   |   |   |-- firebaseConfig.ts
|   |   |   |-- firestoreService.ts
|   |   |   \-- storageService.ts
|   |   |-- gemini/
|   |   |   \-- geminiClient.ts
|   |   |-- scanner/
|   |   |   |-- mobilenetLeaf.ts
|   |   |   \-- plantnetClient.ts
|   |   |-- ai.ts
|   |   |-- api.ts
|   |   |-- locationService.ts
|   |   |-- mandi.ts
|   |   |-- marketService.ts
|   |   |-- messagingService.ts
|   |   |-- notificationService.ts
|   |   \-- weatherService.ts
|   |-- store/
|   |   |-- useAlertStore.ts
|   |   |-- useAppStore.ts
|   |   |-- useAuthStore.ts
|   |   |-- useCategoryStore.ts
|   |   |-- useFarmRentalStore.ts
|   |   |-- useLanguageStore.ts
|   |   |-- useLocationStore.ts
|   |   |-- useMarketStore.ts
|   |   |-- useTodaysPlanStore.ts
|   |   \-- useWeatherStore.ts
|   |-- types/
|   |   |-- crop.ts
|   |   |-- cropAdvisory.ts
|   |   |-- farmer.ts
|   |   |-- fishery.ts
|   |   |-- leafScanner.ts
|   |   |-- livestock.ts
|   |   |-- poultry.ts
|   |   \-- speech-recognition.d.ts
|   |-- utils/
|   |   |-- colorSystem.ts
|   |   |-- cropCalendar.ts
|   |   |-- dateHelper.ts
|   |   |-- externalLinks.ts
|   |   |-- leafScannerPdf.ts
|   |   |-- offline.ts
|   |   \-- unitConverter.ts
|   |-- App.css
|   |-- App.tsx
|   |-- index.css
|   \-- main.tsx
|-- .env.example
|-- .firebaserc
|-- .gitignore
|-- AGENTS.md
|-- CODEBASE_TREE.md
|-- Codebaseknowledge.md
|-- eslint.config.js
|-- final_implementations.md
|-- firebase.json
|-- firestore.rules
|-- index.html
|-- instructions__1_.md
|-- package.json
|-- package-lock.json
|-- postcss.config.js
|-- README.md
|-- storage.rules
|-- tailwind.config.ts
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.node.json
\-- vite.config.ts
~~~

