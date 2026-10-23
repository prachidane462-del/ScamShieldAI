# ScamShield AI — Smart Scam & Fraud Detector

[![Version](https://img.shields.io/badge/version-1.0.0-cyan.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI%20Python%203.13-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/frontend-React%2018%20%7C%20Vite%20%7C%20TypeScript-61DAFB.svg)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/styling-Tailwind%20CSS%203.4-38B2AC.svg)](https://tailwindcss.com)

**ScamShield AI** is an enterprise-grade cybersecurity SaaS web application designed to help everyday citizens and cybersecurity professionals detect, analyze, and defend against fraudulent SMS, WhatsApp messages, phishing URLs, fake job offers, banking OTP harvesting scams, lottery advance-fee fraud, and social engineering attacks.

---

## 🌟 Key Features

### 1. 🛡️ Interactive Message Scanner (Core Feature)
- **Multi-Signal Heuristic & AI Hybrid Engine**: Combines lexical pattern matching, psychological coercion scoring, and optional LLM contextual reasoning.
- **Categorical Detection**:
  - Urgent intimidation & account deactivation threats.
  - OTP, PIN, CVV, and sensitive credential harvesting traps.
  - Fake work-from-home job schemes requiring advance registration deposits.
  - Unsolicited lottery, prize, and lucky draw claims.
  - Brand and authority impersonation (Banks, Courier, Tax, Police).
  - Channel diversion tactics (directing conversations to unmonitored Telegram/WhatsApp numbers).
  - Remote access trojans (demands to install AnyDesk, TeamViewer, or untrusted APKs).
- **Comprehensive Audit Report**:
  - Composite Risk Score (0 to 100) with animated cybersecurity speedometer gauge.
  - Risk classification: **Low Risk (0–29)**, **Suspicious (30–59)**, and **High Risk (60–100)**.
  - Specific highlighted evidence tokens and plain-language reasoning.
  - Actionable security countermeasures and next steps.
  - One-click formatted report clipboard export.

### 2. 🔗 URL & Link Forensics Checker
- **Passive Inspection Without Script Execution**: Never loads malicious payloads or executes JavaScript from untrusted target hosts.
- **SSRF Protection**: Hardened backend rejects internal loopback and metadata addresses (`127.0.0.1`, `169.254.169.254`, `10.0.0.0/8`, `192.168.0.0/16`).
- **Phishing Signatures Checked**:
  - Lookalike Typosquatting (Homoglyphs & Levenshtein distance matching against top brands).
  - Deceptive Subdomain Masquerading (e.g. `paypal.com.attacker.xyz`).
  - Raw numerical IP-address hosts.
  - Abuse-prone disposable TLDs (`.xyz`, `.top`, `.tk`, `.buzz`, `.ml`, `.click`).
  - IDN Punycode attacks (`xn--`).
  - Insecure protocol (HTTP) alerts with educational explanation of the "HTTPS Padlock" myth.
  - Optional Google Safe Browsing Lookup API integration.

### 3. 📊 Dashboard & Telemetry
- Cyber SaaS dark-mode aesthetics (#0B1020 navy, #111A2E deep panels, #22D3EE electric cyan, #8B5CF6 violet).
- Real-time statistics counters (Total scans, potential scams detected, safe results verified).
- Interactive quick tester and recent activity feed.

### 4. 🗄️ Privacy-First Scan History
- Stored **strictly on the user's local device** (`localStorage`). Zero permanent storage of private user messages on the server.
- Category filters (Message vs. URL) and Risk score filters.
- Complete audit modal view and instant one-click deletion controls.
- Export scan history to formatted JSON file.

### 5. 📚 Security Tips & Incident Response
- 8 Detailed threat guides (Fake bank messages, OTP scams, UPI QR traps, Task scams, Lottery scams, Delivery phishing, Digital Arrest scams, Email phishing).
- **Interactive Scam Safety Checklist**: Tick questions before acting to evaluate threat severity.
- **Official Emergency Reporting**:
  - **India**: Cybercrime helpline **1930** & official portal [https://cybercrime.gov.in](https://cybercrime.gov.in) for financial fraud within the golden hour.
  - **United States & International**: US FTC ([reportfraud.ftc.gov](https://reportfraud.ftc.gov)), FBI IC3 ([ic3.gov](https://www.ic3.gov)), and UK Action Fraud.

---

## 🏗️ Architecture & Technology Stack

```
scamshieldAI/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── config.py         # App settings & environment loading
│   │   ├── models.py         # Pydantic v2 data validation models
│   │   ├── main.py           # FastAPI endpoints, CORS & rate limiting
│   │   ├── detectors/
│   │   │   ├── message_analyzer.py  # Transparent heuristic rule engine
│   │   │   ├── url_analyzer.py      # Passive URL inspector & SSRF guard
│   │   │   └── ai_analyzer.py       # LLM provider integration with prompt fences
│   │   └── utils/
│   │       └── security.py   # Sliding-window rate limiter & sanitization
│   ├── tests/                # Automated pytest unit test suite (16 tests)
│   ├── requirements.txt
│   └── run.py                # Backend entry point
├── frontend/                 # React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/       # RiskGauge, Navbar, Sidebar, Modals, Toast
│   │   ├── pages/            # Dashboard, MessageScanner, UrlChecker, History, Tips, About
│   │   ├── services/         # API client & localStorage manager
│   │   ├── data/             # Preset demo messages & test URLs
│   │   └── types/            # TypeScript interfaces
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── .env.example              # Sample environment template
└── README.md
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ (Tested on Node.js v20 LTS)

### Step 1: Clone or Navigate to Project
```bash
cd scamshieldAI
```

### Step 2: Set Up Backend
```bash
# Install Python dependencies
py -m pip install -r backend/requirements.txt

# Start the FastAPI server
py backend/run.py
```
*The backend API will start on `http://127.0.0.1:8000`. You can access interactive Swagger documentation at `http://127.0.0.1:8000/docs`.*

### Step 3: Set Up Frontend
Open a second terminal:
```bash
cd frontend

# Install npm dependencies
npm install

# Start the Vite development server
npm run dev
```
*The web interface will launch on `http://localhost:5173`.*

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `HOST` | Backend bind address | `127.0.0.1` |
| `PORT` | Backend port | `8000` |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini 1.5 Flash API Key | `""` |
| `OPENAI_API_KEY` | *(Optional)* OpenAI GPT-4o-mini API Key | `""` |
| `GOOGLE_SAFE_BROWSING_API_KEY` | *(Optional)* Google Safe Browsing Lookup v4 Key | `""` |
| `RATE_LIMIT_PER_MINUTE` | Max requests per minute per client IP | `60` |

> [!NOTE]
> **Demo & Offline Mode:** ScamShield AI works locally **without any API keys**! If no API keys are provided, the deterministic rule-based heuristic engine handles all analysis with high precision and zero latency.

---

## 🧪 Automated Testing

Run the automated test suite covering edge cases, risk boundary scores, SSRF checks, and API validation:

```bash
py -m pytest backend/tests -v
```

All 16 unit tests verify:
- Prize scam detection & token extraction
- Fake job registration-fee scheme detection
- OTP credential harvesting vs. legitimate bank notices
- Routine personal communication baseline scores (< 30)
- Remote access software (AnyDesk/TeamViewer) detection
- Lookalike typosquatting (`paypa1-security.xyz`)
- Subdomain brand masquerading (`chase.com.account-recovery.xyz`)
- SSRF prevention blocking loopback target `127.0.0.1`
- Raw numerical IP-address link flags
- API rate limiting, health checks, and empty input validation

---

## 🔒 Security & Privacy Guarantees

1. **Untrusted Data Isolation**: All message text is passed between `<UNTRUSTED_CONTENT>` fences to prevent prompt injection and model jailbreaks.
2. **Passive URL Inspection**: Target URLs are parsed syntactically. The application does not fetch or execute active content from untrusted external websites.
3. **SSRF Guard**: Resolves and blocks requests to loopback addresses (`127.0.0.1`), internal LAN IPs (`10.x.x.x`, `192.168.x.x`, `172.16.x.x`), and cloud instance metadata addresses (`169.254.169.254`).
4. **Client-Side Retention**: History logs are persisted only in the user's browser `localStorage` and can be wiped instantly.
5. **No Credential Leakage**: Frontend code never handles secret API keys; all external intelligence calls happen strictly on the Python backend.

---

## ⚖️ Disclaimer

ScamShield AI is an automated cybersecurity analysis system providing algorithmic risk estimates based on detected indicators. It is not an absolute legal determination of fraud. Always verify unexpected communications directly with verified institutions through independent channels. Never share one-time passwords (OTP), banking credentials, or personal identification details over email or SMS.
