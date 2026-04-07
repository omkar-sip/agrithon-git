# Sarpanch AI

**An Intelligent, Digital Companion for the Modern Farmer**

Sarpanch AI leverages modern Web Technologies and Artificial Intelligence to provide real-time agricultural advisories. Designed as a Progressive Web Application (PWA), it aims to empower farmers with actionable insights, market connectivity, and tailored advisory across crop farming, livestock, poultry, and fisheries. The platform is built from the ground up to be accessible, scalable, and tailored to the unique physiological, temporal, and geographical needs of farmers.

![Frontend](https://img.shields.io/badge/FRONTEND-LIVE_ON_VERCEL-00C7B7?style=for-the-badge&logo=vercel&logoColor=white) ![Backend](https://img.shields.io/badge/BACKEND-FIREBASE-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) ![AI](https://img.shields.io/badge/AI_MODELS-GEMINI_PRO-8E75B2?style=for-the-badge&logo=google&logoColor=white) 

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS_3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![React Router](https://img.shields.io/badge/React_Router_v7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=react&logoColor=white) ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) ![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white) ![Hugging Face](https://img.shields.io/badge/Hugging_Face_(Planned)-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)

---

> [!NOTE]
> 🚧 **Beta Access & PWA Notice**
> 
> The current deployed version is operating as an initial **Beta Release** focusing on the foundational AI advisory systems.
> 
> - **Offline Capability**: Features such as IDB-Keyval caching and PWA service workers are active, but core AI features currently rely on internet access for the **Gemini API**.
> - **Data Authenticity**: All agricultural inferences provided by SarpanchGPT and Crop Doctor are currently generated live via Cloud LLMs. 

---

## 📑 Table of Contents

1. [🌍 Overview](#-overview)
2. [🏗 Architecture](#-architecture)
3. [📂 Folder Structure](#-folder-structure)
4. [🤖 AI & Machine Learning Pipeline](#-ai--machine-learning-pipeline)
5. [🚀 Planned Features & Roadmap](#-planned-features--roadmap)
6. [🤝 Contributing](#-contributing)
7. [📄 License](#-license)

---

## 🌍 Overview

The platform translates complex agricultural intelligence into actionable, accessible language tailored explicitly to local environments. By fusing Progressive Web Capabilities (PWA) with Generative AI, Sarpanch AI provides a native-app-like experience to democratize farming insights without the friction of large app store downloads.

---

## 🏗 Architecture

Sarpanch AI adopts a modular, component-driven Frontend architecture integrated with scalable cloud services. 

### Component Flow

| Layer | Responsibility | Technologies |
| :--- | :--- | :--- |
| **Presentation** | UI Rendering, Animations, PWA App Shell | React 19, Tailwind CSS, Framer Motion |
| **State Management**| Global App State, User Session, Persistent Cache | Zustand, IDB-Keyval |
| **Routing / Nav** | Screen transitions, Authentication guards | React Router v7 |
| **Services / AI** | External data fetching, LLM prompts & inferences | Axios, Firebase SDK, Google Gen AI |

---

## 📂 Folder Structure

```text
SarpanchAI/
├── src/                        # Main Application Code
│   ├── assets/                 # Static files (Icons, Images, PWA Manifests)
│   ├── components/             # Reusable UI Architecture
│   │   ├── layout/             # High-level Structural Components (Sidebar, NavBar, AppShell)
│   │   ├── shared/             # Common Business Logic Components
│   │   └── ui/                 # Atomic UI components (Buttons, Inputs, Modals)
│   ├── hooks/                  # Custom React Hooks (e.g., useGeolocation)
│   ├── i18n/                   # Internationalization / Translations (i18next)
│   ├── pages/                  # Route-level Component Views
│   │   ├── auth/               # Authentication Flows
│   │   ├── community/          # Community Forums and SarpanchGPT agent
│   │   ├── crop/               # Crop Management & Advisory
│   │   ├── fishery/            # Aqua-culture module
│   │   ├── home/               # Dashboard and Landing Views
│   │   ├── livestock/          # Livestock Tracking and Management
│   │   ├── poultry/            # Poultry details and Analytics
│   │   ├── settings/           # User configurations
│   │   └── splash/             # PWA Splash Screen and Onboarding
│   ├── router/                 # React Router definitions and configuration
│   ├── services/               # API clients, Firebase config, AI Service Wrappers
│   ├── store/                  # Global Zustand Stores (e.g., useAlertStore)
│   ├── types/                  # Global TypeScript Interfaces (e.g., fishery.ts)
│   └── utils/                  # Helper functions and strict type guards
├── public/                     # Vite public assets and Service Workers
└── package.json                # Dependencies and project scripts
```

---

## 🤖 AI & Machine Learning Pipeline

### Emphasizing Offline Real-Time Models (Hugging Face)

While the initial iteration employs the **Google Gemini API** for advisory inference, a dedicated migration roadmap targets open-source, on-device (or edge-hosted) **Hugging Face** models. This is crucial for farmers lacking continuous, high-speed internet access.

| Current System (Online API) | Planned Migration (Hugging Face / Offline-first) | Purpose & Benefit |
| :--- | :--- | :--- |
| **Gemini Pro (Text/Chat)** | `meta-llama/Llama-3-8B-Instruct` or `mistralai/Mistral-7B-Instruct-v0.2` | Runs conversational inference for **Sarpanch AI** locally or via lightweight edge-APIs. Ensures privacy and offline robustness. |
| **Gemini Vision** | `llava-hf/llava-1.5-7b-hf` or `Qwen/Qwen-VL` | **Crop Doctor**: visual inference on crop diseases directly from uploaded images. Can be quantized via ONNX/TensorFlow Lite for mobile web. |
| **Cloud Text-to-Speech** | `suno/bark` or `kakao-enterprise/vits-ljs` | **Voice Agent**: Converts native language answers directly to voice without requiring heavy cloud connections. |
| **Cloud Speech-to-Text** | `openai/whisper-tiny` (or `whisper-base`) | **Voice Input**: Operates locally via WASM in the browser for multilingual voice ingestion. |

*Note: Migrating to quantized models (GGUF via `transformers.js` in the browser) will allow the core AI features to operate completely offline as a true progressive web experience.*

---

## 🚀 Planned Features & Roadmap

The following modules represent the crucial gaps waiting to be filled to transform **Sarpanch AI** into a complete AgTech ecosystem.

### Crop Farming – Things Still Missing

1. 📄 **Crop Doctor Improvements**:
   - Provide integration with the Gemini API to analyze crops, generate **clear, bold PDF reports**, and allow farmers to heavily download them.

2. 🌐 **Multilingual Support**:
   - Not currently equipped. Future releases will localize reports, advisories, and the UI into regional languages.

3. 🏪 **Mandi Marketplace**:
   - A platform for direct farmer-to-retailer/consumer deals without middlemen.
   - *Roadmap*: Initially a standard basic version marketplace without blockchain, with plans to later integrate **Solidity Blockchain** for secure smart contracts and transparent ledgers.

4. 🚜 **Equipment Renting Feature**:
   - A peer-to-peer and business-to-peer rental module allowing farmers to lease tractors, harvesters, and specialized tools.

5. 🤝 **BADLA (Farmer Connect)**:
   - A hyper-local networking space where farmers connect with others nearby for labor, barter systems, or cash-based gigs.

6. ⚖️ **Legal Survey Option**:
   - Portal to request official land surveys, helping farmers resolve border disputes and handle documentation efficiently.

7. 🏛 **Government Portal Linking**:
   - A direct gateway where schemes, subsidies, and crop insurance policies are accessible directly inside the application.

8. 📈 **AI CA (Agricultural Chartered Advisor)**:
   - A scalable financial advisor designed for farmers. Dedicated to suggesting strategies for scaling, sustainability, and guiding farmers to the right government schemes.

9. 🎙️ **Voice Agent "Sarpanch AI" Fine-Tuning**:
   - Fine-tune the current conversational UX so farmers can interact naturally through voice in their own native language.

---

## 🤝 Contributing

Contributions are always welcome! Ensure you adhere to the project's coding standards. The primary branch is `main`. Please ensure that your pull requests define clear context and reference any existing issues.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
