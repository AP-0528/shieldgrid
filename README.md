# ShieldGrid 🛡️
### AI-Powered Parametric Income Protection for India's Delivery Workers

> Zero-touch claims. Automated payouts. No forms. No calls.

---

## How It Works

ShieldGrid operates as a fully automated parametric insurance platform. The entire flow from registration to payout requires **zero manual intervention**.

```
┌─────────────────────────────────────────────────────────────────┐
│                     SHIELDGRID ARCHITECTURE                     │
│                                                                 │
│  📱 Mobile App (React Native / Expo)                            │
│  ├── Registration → Policy Issuance → Dashboard → Claims        │
│       │                                                         │
│       ▼                                                         │
│  🔗 NestJS API (Port 3000) — Transactional Layer                │
│  ├── User Onboarding   → PostgreSQL                             │
│  ├── Policy Management → PostgreSQL                             │
│  ├── Payout Processing → Razorpay (Simulated)                   │
│       │                                                         │
│       ▼                                                         │
│  🧠 FastAPI ML Oracle (Port 8000) — Intelligence Layer          │
│  ├── XGBoost Risk Model  → Dynamic Weekly Premium               │
│  ├── Isolation Forest    → GPS Fraud Detection                  │
│  └── Trigger Oracle      → Monitors 5 Disruption Channels       │
│       │                                                         │
│       ▼                                                         │
│  🐘 PostgreSQL (Port 5433) + ⚡ Redis (Port 6379)               │
│     via Docker                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## The End-to-End Flow

### 1. 📋 Registration
A delivery worker opens the app and fills in:
- **Full Name** and **Worker ID**
- **UPI ID** — where payouts land instantly
- **Delivery Platform** — Zomato, Swiggy, Blinkit, Dunzo, or Zepto
- **Operating Zone** — selects their primary delivery area

> **AI in Action**: As soon as a zone is selected, the app calls the ML Oracle (`/evaluate-zone-risk`) which runs the **XGBoost model** on historical rain data, traffic velocity, and zone density for that specific area. The weekly premium is displayed in real-time — workers in historically safer zones like Whitefield get a **₹2 discount** automatically.

---

### 2. 📄 Policy Issuance
On submit, the app:
1. Creates the worker profile in **PostgreSQL** via the NestJS API
2. Issues a **LIVE Weekly Policy** with the ML-calculated premium
3. Stores the session locally for seamless re-entry

The **Dashboard** then shows:
- Policy status: **LIVE** (green) or **INACTIVE** (claim processed)
- Weekly premium with XGBoost multiplier breakdown
- Real-time **Risk Environment** meter for their zone

---

### 3. 💡 Dynamic Premium Calculation

The ML Oracle (`/evaluate-zone-risk`) computes premium as:

```
Weekly Premium = Base (₹15) × Risk Multiplier − Zone Safety Discount

Where Risk Multiplier = XGBoost(zone_density, historical_rain_mm, avg_traffic_velocity)
```

| Zone | Risk Multiplier | Discount | Final Premium |
|---|---|---|---|
| Koramangala, BLR | 1.2x | ₹0 | ₹18 |
| Whitefield, BLR | 0.9x | ₹2 | ₹11.50 |
| Indiranagar, BLR | 1.3x | ₹0 | ₹19.50 |
| HSR Layout, BLR | 1.0x | ₹1 | ₹14 |

---

### 4. 🚨 5 Automated Disruption Triggers

The **Trigger Oracle** polls 5 independent data channels every 10 seconds:

| # | Trigger | Data Source | Threshold | Payout |
|---|---|---|---|---|
| 1 | 🌧️ **RAINFALL** | OpenWeatherMap API | >50mm/hr | ₹800 |
| 2 | 🌡️ **HEATWAVE** | IMD Temperature API | >45°C | ₹600 |
| 3 | 🚗 **TRAFFIC_JAM** | Mapbox Traffic API | <5 km/h avg velocity | ₹500 |
| 4 | 💨 **AQI_HAZARD** | CPCB Air Quality Index | AQI >300 | ₹400 |
| 5 | 🚫 **CIVIC_CURFEW** | Govt Alert API (Mock) | Section 144 declared | ₹1000 |

When a threshold is crossed, the Oracle fires a trigger to the NestJS API automatically.

---

### 5. ✅ Zero-Touch Claim Process

```
Disruption Detected
       │
       ▼
Isolation Forest Fraud Check (GPS Ping Validation)
       │
       ├── FRAUD? → Reject. Log anomaly.
       │
       └── VALID? → Process Payout
                       │
                       ▼
               Razorpay UPI Transfer
                       │
                       ▼
               Claims Tab Updated (auto-refresh every 5s)
                       │
                       ▼
               Worker receives ₹ — Zero forms. Zero calls.
```

The worker sees the payout appear in their **Claims** tab automatically with:
- Trigger type and icon
- Payout amount
- Immutable transaction ID
- Timestamp and coverage week

---

## 🛠️ How to Run Locally

You need **Docker**, **Node.js 18+**, **Python 3.10+**, and the **Expo CLI**.

### Step 1 — Clone the repository
```bash
git clone https://github.com/AP-0528/Shieldgrid.git
cd Shieldgrid
git checkout integration-final
```

### Step 2 — Start Infrastructure (Database + Cache)
```bash
docker-compose up -d
```
This starts **PostgreSQL** on port 5433 and **Redis** on port 6379.

### Step 3 — Start the Transactional API (NestJS)
```bash
cd backend/api
npm install
npm run start:dev
```
API will be live at `http://localhost:3000`

### Step 4 — Start the ML Oracle (FastAPI)
```bash
cd backend/ml
python -m venv venv
.\venv\Scripts\activate        # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
ML API will be live at `http://localhost:8000`

### Step 5 — Start the Frontend (Expo)
```bash
# From project root
npx expo start --web
```
Open `http://localhost:8081` in your browser.

---

## 🔄 Demo Reset (Between Judges)

To wipe all data and start fresh:
1. Go to the **Profile** screen (person icon, top-left on dashboard)
2. Tap **"Reset Demonstration"** at the bottom
3. The app returns to the registration screen; the database is wiped

Or via terminal:
```bash
docker-compose down -v && docker-compose up -d
```

---

## 🧪 API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/onboard` | Register a new worker |
| POST | `/policy/issue` | Issue a LIVE policy (calls ML Oracle) |
| POST | `/payouts/trigger` | Fire a disruption event (Oracle → NestJS) |
| GET | `/payouts/:userId` | Get all payouts for a user |
| POST | `/demo/reset` | Wipe all data for a fresh demo |
| POST | `ML:8000/evaluate-zone-risk` | Zone-aware premium calculation |
| GET | `ML:8000/trigger-types` | List all 5 covered disruption types |
| POST | `ML:8000/verify-presence` | Isolation Forest fraud validation |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile / Web App | React Native + Expo Router |
| Transactional API | NestJS + TypeORM |
| ML Oracle | FastAPI + XGBoost + Scikit-learn |
| Database | PostgreSQL (via Docker) |
| Cache / Rate-limit | Redis (via Docker) |
| Payout Integration | Razorpay (Test Mode, Simulated) |
| Containerization | Docker Compose |

---

## Inspiration

Every monsoon season in India, millions of delivery partners stare at a flooded street — not because they're scared, but because two-wheelers simply cannot move through knee-deep water. That lost shift isn't recoverable. There's no overtime, no leave, no safety net. It's just gone.

ShieldGrid was built to fix that. Parametric insurance — where a payout triggers automatically from a verifiable external event instead of a claim form — is the missing piece for gig worker protection. A delivery partner in Bengaluru should have the same protection as a farmer in Maharashtra the moment the IMD declares a red alert in their pincode.

**ShieldGrid makes that real.**
