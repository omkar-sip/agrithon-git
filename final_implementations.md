🎯 CORE PRODUCT GOAL

Build a decision-support system for farmers, focused on:

Fair pricing
Cost clarity
Risk protection
Simple guidance
🧩 FEATURE PLAN (FINAL + HONEST)
1. 🎙️ Sarpanch Salah (EXISTING FEATURE – MODIFY ONLY)
Current State
AI voice agent already exists
Required Changes
Rename to Sarpanch Salah
Improve prompts for:
short responses
local language (Hindi/Kannada)
actionable answers
AI Prompt Standard
You are a farming expert.
Respond in simple Hindi or regional language.
Keep answers:
- under 5 lines
- practical
- step-based if needed
Integration Rules

Use centralized AI service:

/services/ai.ts
DO NOT create another chat feature
2. 🌾 Mandi Saathi (RESTRUCTURE EXISTING MARKETPLACE)
Current State
Marketplace exists
Functions like basic online shop
Does NOT solve pricing problem
❗ Core Problem

Farmers:

Don’t know real mandi price
Get underpaid
Sell blindly
🎯 Goal

Convert marketplace into:

Price-aware selling system

🔧 Implementation Requirements
Step 1: Rename
Existing marketplace → Mandi Saathi
Step 2: Add Real-Time Price Layer

Create:

/services/mandi.ts

Functions:

getMandiPrice(crop, location)
cache using idb-keyval
Step 3: Farmer Flow
Screen 1 → Select Crop

Show:

Today's mandi price:
min / max / avg
Nearby mandi comparison
Screen 2 → Create Listing

Fields:

Crop
Quantity
Price (auto-suggest mandi avg)
Location
Step 4: Price Intelligence Logic
Auto-fill price = mandi average
Show warnings:
IF price < mandi avg:
→ "You are selling below market price"

IF price > mandi max:
→ "Price too high, may not sell"
Step 5: Firestore Schema
mandiListings/
  farmerId
  crop
  quantity
  price
  mandiReferencePrice
  location
  createdAt
Step 6: Buyer Flow
Wholesalers see:
farmer price vs mandi price
Build trust through transparency
💡 Outcome
Farmers stop guessing prices
Middlemen advantage reduces
Platform becomes pricing authority
3. 🌱 Mitti Sehat (NEW FEATURE)
Purpose

Help farmers:

Understand soil condition
Get fertilizer recommendations
Improve yield
Implementation
Frontend
Simple form:
Soil type
Crop
Optional NPK values
Backend

Firestore:

soilReports/
  userId
  input
  result
  createdAt
AI Integration
Analyze soil data and return:
- fertilizer suggestion
- crop suitability
- in simple Hindi
- max 5 bullet points
Optimization
Cache results locally
Avoid repeated API calls
4. 💰 Kheti Kharcha (NEW FEATURE)
Purpose

Help farmers:

Estimate cost
Predict profit
Implementation
Logic (NO AI)
Total Cost = seeds + fertilizer + labor
Revenue = yield × mandi price
Profit = revenue - cost
Firestore
budgets/
  userId
  crop
  cost
  revenue
  profit
UI
Show:
total cost
expected profit
breakdown
💡 Impact
Farmers stop operating blindly
Make financially informed decisions
5. 🛡️ Sauda Suraksha (NEW FEATURE)
Purpose

Protect farmers from:

bad contracts
hidden clauses
Flow
Upload contract → Firebase Storage
Extract text
Send to Gemini
AI Prompt
Analyze this contract:
- highlight risky clauses
- simplify in Hindi
- mark SAFE or RISKY
Firestore
contracts/
  userId
  fileUrl
  analysis
6. 🏛️ Sarkari Yojana (NEW FEATURE)
Purpose

Help farmers:

find schemes
check eligibility
Implementation
Firestore
yojanas/
  title
  eligibility
  benefits
  state
Logic
IF land < threshold → eligible
IF income < threshold → eligible
UI
Filters:
state
category
Button:
→ "Check Eligibility"
🔗 SHARED SYSTEMS
🌐 Language
i18next
Store in Zustand
AI responds in selected language
📍 Location
Store globally
Use in:
mandi prices
schemes
📡 Offline

Cache:

mandi prices
soil reports
yojanas
⚡ Performance
Lazy load modules
Avoid unnecessary re-renders
⚠️ NON-NEGOTIABLE RULES
Keep UI extremely simple
Avoid heavy text
Use icons + voice where possible
All outputs must be:
short
actionable
local-language friendly
🎯 FINAL PRODUCT FLOW

Farmer:

Checks mandi price (Mandi Saathi)
Lists crop at correct price
Calculates profit (Kheti Kharcha)
Gets soil guidance (Mitti Sehat)
Verifies contracts (Sauda Suraksha)
Gets help via voice (Sarpanch Salah)
Finds schemes (Sarkari Yojana)