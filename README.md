# AgriFlow — Master Build V2

> **Predict. Coordinate. Reach Every Farmer.**
> *A procurement flow intelligence and multi-channel communication platform that helps centres act before congestion grows and ensures farmers can access guidance through smartphones, basic phones, voice or human assistance.*

Built for the **Smart India Hackathon (SIH)**.

---

## 🌾 1. Product Definition & Core Innovation

> **"Existing procurement systems digitise transactions. AgriFlow adds procurement flow intelligence and multi-channel farmer access."**

Existing systems already manage farmer registration and slot booking. AgriFlow complements them by solving the operational coordination problem:
**How can procurement centres anticipate arrival pressure and communicate understandable guidance to farmers before avoidable congestion occurs?**

The system follows three clear operational loops:
- **For Farmers**: See $\longrightarrow$ Understand $\longrightarrow$ Act
- **For Operators**: Monitor $\longrightarrow$ Predict $\longrightarrow$ Act $\longrightarrow$ Communicate
- **For Administrators**: Overview $\longrightarrow$ Identify $\longrightarrow$ Coordinate

---

## 📱 2. Basic Phone Fallback Matrix

AgriFlow is strictly **NOT** smartphone-only. Every function is accessible across three tiers of technology:

| Function | Smartphone | Basic Button Phone | Assisted Access |
| :--- | :---: | :---: | :---: |
| **Centre Status** | App | IVR | Operator / CSC |
| **Booking a Visit** | App | DTMF IVR | Operator Assisted Desk |
| **Booking Status** | App | IVR / SMS | Operator / CSC |
| **Alerts & Warnings** | App | SMS / Outbound Voice | Operator |
| **Recommended Time** | App | Voice Call / SMS | Operator |
| **Help & Guidance** | App | IVR (1800-AGRIFLOW) | In-person Helpdesk |

---

## 🚜 3. Farmer Experience (Zero AI Terminology)

Farmers never see words like *"AI Prediction"*, *"Machine Learning"*, *"Risk Score"*, *"Forecast Accuracy"*, or *"Processing Capacity"*. Instead, they see clear, human-centered guidance:

### 🌾 Greeting & Centre Card
- Localized greeting: **வணக்கம் 👋** (Tamil) / **नमस्ते 👋** (Hindi) / **Welcome 👋** (English)
- **Centre Status**:
  - 🟢 **LOW CROWD** — Crowd is currently low. You may visit now.
  - 🟡 **MODERATE CROWD** — Waiting may take longer. Better time: After 2:00 PM.
  - 🔴 **HIGH CROWD** — More farmers are currently at the centre. If possible, visit after 2:00 PM. Your booking remains active.

### 🕒 Best Time Card
- **BEST TIME TO VISIT: After 2:00 PM** (Less crowd is expected).

### 🔊 Voice-First Accessibility
- **🔊 Listen** button reads the status and arrival recommendation aloud in the farmer's selected language (**தமிழ்**, **हिन्दी**, **English**) using speech synthesis.

### 📅 Only Four Main Actions
1. **My Booking** (View token or book a visit: 🟢 10:00 AM / 🟡 12:00 PM / 🟢 02:00 PM)
2. **Centre Status** (Current crowd level and recommended arrival window)
3. **Alerts** (Verified alerts with SMS copy and voice playback)
4. **Help** (5 common questions + Direct 1-tap call to `1800-180-1551` + **🎤 Speak** input)

---

## 📞 4. Interactive Phone IVR & Missed Call Simulator

Accessible directly from the header via the **"📞 IVR / Basic Phone"** button:

1. **Language Selection**:
   - Automated Voice: *"Welcome to AgriFlow. தமிழுக்கு 1ஐ அழுத்தவும். हिंदी के लिए 2 दबाएं. Press 3 for English."*
2. **Farmer Identification**:
   - Keypad entry: Enter Farmer ID + # (e.g. `1024#`).
   - Recognizes registered farmer profile (Sukhwinder Sharma).
3. **Services Menu**:
   - Press 1 to check token booking status.
   - Press 2 to book a visit slot (10 AM, 12 PM, 2 PM).
   - Press 3 to hear centre crowd information.
   - Press 4 to get official helpdesk contact.
4. **Interactive 12-Key DTMF Dialpad**:
   - On-screen basic button phone keypad with audio feedback and speech synthesis.
5. **Missed Call Callback Simulation**:
   - Click *"Test Missed Call Callback"* $\longrightarrow$ system identifies registered caller $\longrightarrow$ initiates automated callback within 2 seconds!

---

## 📢 5. Operator Communication Centre

Located in the Operator Sidebar (`/operator` $\longrightarrow$ **Communication Centre**):

- **Target Farmer Selection**:
  - ☑ Farmers with upcoming bookings (48 selected)
  - ☑ Farmers affected by crowd (32 selected)
  - ☑ Gate 2 waiting queue (12 selected)
- **Message Types (Verified Templates)**:
  - 🔴 Crowd Alert
  - 🟡 Recommended Arrival Time
  - 📅 Booking Confirmation
  - ℹ Centre Information
- **Multi-Channel Dispatch**:
  - ☑ SMS (Standard Cellular)
  - ☑ Voice IVR Broadcast (Automated outbound call)
  - ☑ Smartphone App Push
- **🔊 Play Voice Preview**:
  - Operator hears the exact synthesized voice broadcast before sending.
- **Live Delivery Tracking**:
  - **SMS**: ✓ Delivered: 42 | ⏳ Pending: 3 | ✕ Failed: 1
  - **Voice**: ✓ Connected: 39 | ⏳ Calling: 5 | ✕ Busy: 2
  - **App**: ✓ Pushed: 48

---

## 🤝 6. Operator-Assisted Booking Desk

Located in the Operator Sidebar (`/operator` $\longrightarrow$ **Assisted Booking**):
- *"A human is sometimes the best interface."*
- Search farmer by ID, phone number, or name.
- View preferred language and communication channel (e.g., F1024, Tamil, Voice preferred, SMS backup).
- Select available arrival window (10:00 AM, 12:00 PM, 02:00 PM).
- Confirm booking $\longrightarrow$ System creates token and automatically dispatches SMS/Voice confirmation.
- 1-click **Print Token Slip** for paper receipts.

---

## 📊 7. Operator Dashboard

- **Left Sidebar**:
  - 📊 Dashboard
  - 👥 Queue Management
  - 📅 Bookings Register
  - 📢 Communication Centre
  - 🤝 Assisted Booking
  - 📈 Flow Reports
  - ⚙ Centre Settings
- **Top Section**:
  - Farmers Waiting: **18**
  - Expected Arrivals: **24**
  - Processing Today: **42**
  - Centre Status: **Moderate / High Pressure**
- **Arrival Trend**:
  - Simple timeline: 9 AM (Low) $\to$ 10 AM (Moderate) $\to$ 11 AM (High) $\to$ 12 PM (High) $\to$ 2 PM (Low)
- **Congestion Prediction**:
  - NEXT 2 HOURS: 🔴 **HIGH PRESSURE EXPECTED**
  - **Why?** More farmers expected between 11 AM – 12 PM, Current queue increasing, Processing rate slower than arrival rate.

---

## 🚀 8. Quick Start & Presentation Guide

### Run Locally
```bash
# Install packages
npm install

# Start preview server
npm run preview
# (or dev mode): npm run dev
```
Open **`http://localhost:4173`** in your browser.

### Recommended 5-Minute Hackathon Demo Script

1. **Farmer View (`/farmer`)**:
   - Point out the greeting: **வணக்கம் 👋** / **Welcome 👋**.
   - Show the simple crowd status: 🔴 **HIGH CROWD**.
   - Show the guidance: 🕒 **BEST TIME TO VISIT: After 2:00 PM**.
   - Click **🔊 Listen** to hear the audio read-out in Tamil/Hindi/English.
2. **Basic Phone IVR Simulator**:
   - Click **"📞 IVR / Basic Phone"** in the top header.
   - Click *"Test Missed Call Callback"* to demonstrate zero-internet access.
   - Press `1` for Tamil $\to$ enter `1024#` $\to$ press `2` to book a visit $\to$ press `3` for 2:00 PM $\to$ press `1` to confirm.
3. **Operator Dashboard (`/operator`)**:
   - Show the 5-second situational awareness cards (Waiting: 18, Expected: 24).
   - Point out **"NEXT 2 HOURS: HIGH PRESSURE EXPECTED"** and the plain-language explainability reasons.
4. **Communication Centre**:
   - In sidebar, click **Communication Centre**.
   - Show 48 upcoming farmers selected $\to$ click **🔊 Play Voice Preview** $\to$ click **Send Alert**.
   - Show real-time delivery telemetry (42 delivered, 3 pending, 1 failed).
5. **Assisted Booking**:
   - In sidebar, click **Assisted Booking**. Search "Gurpreet", book 2:00 PM, and show the printable gate pass.
