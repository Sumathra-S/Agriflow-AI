# AgriFlow AI — Smart India Hackathon 2026 (Grand Finale)

> **Know the crowd before it arrives.**
> *Predict arrival pressure. Test coordination actions. Reach every farmer.*
> 
> Current Deployment: **[agriflow-ai-five.vercel.app](https://agriflow-ai-five.vercel.app)**
> Repository: **[Sumathra-S/Agriflow-AI](https://github.com/Sumathra-S/Agriflow-AI)**

---

## 🌾 1. Core Product Definition

**AgriFlow** is an operational intelligence and inclusive communication layer for agricultural procurement centres.

It does **NOT** claim to replace existing government procurement portals (e.g. e-NAM, PM-KISAN, State Food & Civil Supplies). Existing systems manage farmer registration, token issuing, and notifications. AgriFlow focuses precisely on the operational bottleneck **after booking**:
1. **Predicting arrival congestion in tonnes** before tractor trolleys reach the gate.
2. **Coordinating multi-centre cluster rebalancing** when an individual mandi hits capacity.
3. **Reaching every farmer** through smartphones, basic phone SMS, interactive voice (IVR), USSD (`*384#`), and Common Service Centre (CSC) assisted access.

---

## 🏛️ 2. Strict Role-Based Architecture (RBAC)

AgriFlow strictly enforces three separate operational experiences:

```
                               ┌──────────────────────────────────────────────────────────┐
                               │                    AGRIFLOW AI LAYER                     │
                               └──────────────────────────────────────────────────────────┘
                                                            │
                     ┌──────────────────────────────────────┼──────────────────────────────────────┐
                     │                                      │                                      │
                     ▼                                      ▼                                      ▼
           👨‍🌾 FARMER PORTAL                   🏢 CENTRE OPERATOR                     🏛️ DISTRICT ADMIN
         (Rural & Mobile-First)              (Singanallur Hub - Centre C)           (Multi-Centre Command)
         ────────────────────────             ──────────────────────────             ─────────────────────
         1. Home (Next Procurement)           1. Centre Overview                     1. All Centres (12 Mandis)
         2. Book Slot (5-Step Wizard)         2. Live Queue & Calling                2. Farmers Directory
         3. Best Centre (Explainable)         3. Arrivals Desk (Gate 2)              3. Operators & Shifts
         4. My Queue (Token AF-108)           4. Token Management                    4. Master Bookings Register
         5. Procurement Status (8-Stage)      5. Weighing Console (60t)              5. Quantity Demand (Tonnes)
         6. Payment (₹23/kg MSP DBT)          6. Quality Check (Moisture)            6. Congestion Monitor
         7. Notifications (Urgent/Info)       7. Procurement Sanctioning             7. Predictive Analytics
         8. Profile (PM-KISAN Linked)         8. Counters & Bays                     8. PFMS Payments Ledger
         9. Help (Helpline & USSD *384#)      9. Capacity (100t vs 90t)              9. Tamper Audit Logs (SHA-256)
                                             10. Operational Alerts                 10. Demand Surge Simulator ⭐
                                                                                    11. District Policy Settings
                                                                                    12. System Health (/api/health)
```

---

## ⚡ 3. Grand Finale Killer Features & Innovations

### A. Quantity-Aware Demand Engine
- Traditional systems count farmer appointments blindly (e.g. "20 farmers").
- AgriFlow models capacity and demand in **Metric Tonnes**:
  - **Singanallur Hub (Centre C)**: Capacity = `100t`
  - Booked Slots = `72t`
  - Predicted Walk-In Demand = `+18t`
  - Total Expected Load = `90t` (90% Utilization — **NEAR CAPACITY**)

### B. Predicted Walk-in Demand Estimation
- Automatically calculates historical walk-in ratios (default `+25%`) and harvest speed index.
- Accurately warns operators 45–60 minutes before unbooked tractor trolleys bottleneck the weighbridge.

### C. Smart Arrival & Dynamic Departure Engine
- Calculates personalized departure guidance:
  $$\text{Departure Time} = \text{Expected Service Time} - \text{Travel Time} - \text{Buffer}$$
- Example: **Token AF-108** at 11:30 AM slot $\longrightarrow$ *"Leave farm at 10:40 AM to arrive smoothly without standing in the sun."*
- If a weighbridge delay occurs, the system **auto-recalculates** and notifies the farmer (+15m delay $\longrightarrow$ departure shifts to 10:55 AM).

### D. Demand Surge & Dynamic Redirection Simulator
- District Admins can simulate real-world spikes: `+10t`, `+25t`, or `+50t`.
- When volume exceeds `100t`, Centre C switches to **OVER CAPACITY** (Critical Red).
- The automatic load balancer routes excess volume to **Centre B (Sulur APMC)** which has 45t free headroom.
- Automated SMS/IVR advisories are generated to redirect incoming tractor traffic.
- Evaluators can click `RESET DEMO` to immediately return to the 80t baseline.

---

## 📱 4. Rural & Inclusive Accessibility Matrix

| Channel | Technology | Use Case in AgriFlow |
| :--- | :--- | :--- |
| **Farmer Mobile Web** | Smartphone (2G/EDGE Mode) | 9 tabs, large contrast typography, dual navigation |
| **Basic SMS** | 2G Cellular (CDAC / NIC) | Departure reminders, token call alerts, PFMS UTR voucher |
| **Interactive Voice (IVR)** | Toll-Free `1800-180-1551` | Keypad DTMF menu in Tamil, Hindi, English, Punjabi |
| **USSD Service** | Cellular Code `*384#` | Instant menu for offline token tracking without internet |
| **CSC Assisted Desk** | In-Person Village Desk | Operator-assisted booking for elderly/non-literate farmers |

---

## 🎯 5. SIH Grand Finale Evaluator Demo Walkthrough (5-Minute Script)

1. **Start on Landing Page**:
   - Point out the core product definition and taglines.
   - Click **Explore Platform** $\longrightarrow$ log in with demo credentials.

2. **Demonstrate 👨‍🌾 Farmer Role**:
   - **Home**: Next procurement session card (Singanallur, Token AF-108, 8 ahead).
   - **Book Slot**: Walk through the 5-step wizard with crop, quantity in kg, date, vehicle, and AI centre recommendation.
   - **Best Centre**: View transparent comparison between Centre C and Centre B.
   - **My Queue**: Test the queue countdown (10 ahead $\longrightarrow$ 7 $\longrightarrow$ 5 $\longrightarrow$ 0 YOUR TURN!) and simulate delay.
   - **Payment**: View the official Form J / MSP settlement voucher (1,000 kg @ ₹23/kg = ₹23,000 DBT).

3. **Demonstrate 🏢 Centre Operator Role**:
   - Switch role to **Operator** (Balwinder Dhillon, locked to Singanallur Centre C).
   - Point out **Strict Isolation**: Clicking "Access Sulur Hub" triggers a `403 Forbidden` RBAC security notice.
   - Test operational buttons in sequence:
     `MARK ARRIVED` $\longrightarrow$ `CALL TOKEN` $\longrightarrow$ `START WEIGHING` $\longrightarrow$ `COMPLETE WEIGHING` $\longrightarrow$ `PASS QUALITY` $\longrightarrow$ `COMPLETE PROCUREMENT` $\longrightarrow$ `PAYMENT INITIATED`.

4. **Demonstrate 🏛️ Administrator & Killer Surge Simulator**:
   - Switch role to **District Administrator**.
   - Navigate to **Demand Surge Simulator** tab.
   - Click `+25 TONNES SURGE` $\longrightarrow$ Singanallur spikes to `105t` (OVER CAPACITY).
   - Show how AgriFlow automatically balances load to Sulur Hub (Centre B) and dispatches advisories.
   - Click `RESET DEMO` to return to baseline.
   - Inspect **Audit Logs** (tamper-evident SHA-256 chain) and **System Health** (`/api/health` 200 OK).

---

## 🛠️ 6. Technology Stack & Defensibility

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons
- **State Management**: Reactive Custom Event Bus (`src/services/engine/eventBus.ts`)
- **Security & RBAC**: Strict centre isolation guards, farmer data privacy check, rate limiting
- **Audit Logging**: SHA-256 signed tamper-evident ledger (`TamperEvidentAuditTrail.tsx`)
- **Accessibility**: Web Speech Synthesis API, bilingual localization (English, Tamil, Hindi, Punjabi)
- **Deployment**: Production-ready on Vercel (`npm run build` zero-warning TypeScript compilation)

---

## 🚀 7. Local Setup & Build

```bash
# Clone the repository
git clone https://github.com/Sumathra-S/Agriflow-AI.git
cd Agriflow-AI

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run type check
npx tsc --noEmit

# Run development server
npm run dev

# Production build
npm run build
```

---
*Built with ❤️ for Indian Farmers & Smart India Hackathon 2026 Grand Finale.*
