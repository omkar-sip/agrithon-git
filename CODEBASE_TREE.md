# Codebase Tree

This file is a lightweight path index to quickly locate code and reduce repeated repository scans.

- Generated: 2026-04-08 20:44:39 +05:30
- Root: D:\AGRITHON GIT
- Excluded directories: .git, .tmp, node_modules
- Regenerate: powershell -ExecutionPolicy Bypass -File scripts/generate-codebase-tree.ps1

~~~text
.
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
|   |   |   |-- PageTransition.tsx
|   |   |   \-- TopBar.tsx
|   |   |-- shared/
|   |   |   |-- AlertBanner.tsx
|   |   |   |-- BannerCarousel.tsx
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
|   |   |-- useGemini.ts
|   |   |-- useGeolocation.ts
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
|   |   \-- index.ts
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
|   |   |   |-- HyperlocalAlerts.tsx
|   |   |   |-- MarketPrices.tsx
|   |   |   |-- SchemesBenefits.tsx
|   |   |   |-- SoilHealth.tsx
|   |   |   |-- SupplyChain.tsx
|   |   |   \-- WeatherAlerts.tsx
|   |   |-- farm-rental/
|   |   |   |-- FarmEquipmentCard.tsx
|   |   |   |-- FarmRentalCategory.tsx
|   |   |   |-- FarmRentalCategoryCard.tsx
|   |   |   |-- farmRentalData.ts
|   |   |   \-- FarmRentalHome.tsx
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
|   |   \-- splash/
|   |       |-- CategorySelect.tsx
|   |       |-- LanguageSelect.tsx
|   |       \-- SplashScreen.tsx
|   |-- router/
|   |   \-- index.tsx
|   |-- services/
|   |   |-- firebase/
|   |   |   |-- authService.ts
|   |   |   |-- firebaseConfig.ts
|   |   |   \-- firestoreService.ts
|   |   |-- gemini/
|   |   |   \-- geminiClient.ts
|   |   |-- api.ts
|   |   |-- marketService.ts
|   |   |-- messagingService.ts
|   |   |-- notificationService.ts
|   |   \-- weatherService.ts
|   |-- store/
|   |   |-- useAlertStore.ts
|   |   |-- useAppStore.ts
|   |   |-- useAuthStore.ts
|   |   |-- useCategoryStore.ts
|   |   |-- useLanguageStore.ts
|   |   |-- useMarketStore.ts
|   |   |-- useTodaysPlanStore.ts
|   |   \-- useWeatherStore.ts
|   |-- types/
|   |   |-- crop.ts
|   |   |-- farmer.ts
|   |   |-- fishery.ts
|   |   |-- livestock.ts
|   |   |-- poultry.ts
|   |   \-- speech-recognition.d.ts
|   |-- utils/
|   |   |-- colorSystem.ts
|   |   |-- cropCalendar.ts
|   |   |-- dateHelper.ts
|   |   |-- offline.ts
|   |   \-- unitConverter.ts
|   |-- App.css
|   |-- App.tsx
|   |-- index.css
|   \-- main.tsx
|-- .env.example
|-- .gitignore
|-- AGENTS.md
|-- CODEBASE_TREE.md
|-- eslint.config.js
|-- index.html
|-- instructions__1_.md
|-- package.json
|-- package-lock.json
|-- postcss.config.js
|-- README.md
|-- tailwind.config.ts
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.node.json
\-- vite.config.ts
~~~

