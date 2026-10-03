# Maint-AI

An AI-powered predictive maintenance and issue management system designed to help identify equipment problems, analyze sensor data, determine maintenance priority, and generate maintenance work orders.

---

##  Overview

Maint-AI is a full-stack maintenance management application that combines:

- Equipment management
- Issue reporting
- Sensor-based rule analysis
- Operating event tracking
- AI-powered issue analysis
- Maintenance priority calculation
- Work Order generation
- Technician approval/rejection workflow
- Maintenance history tracking

The system is designed around a simple workflow:

```text
Equipment
   ↓
Report Issue
   ↓
Sensor Readings + Operating Events
   ↓
Issue Analysis
   ↓
Sensor Validation
   ↓
Sensor Conflict Detection
   ↓
Rule Engine
   ↓
Priority Calculation
   ↓
Knowledge Search
   ↓
AI Analysis
   ↓
Draft Work Order
   ↓
Technician Review
   ├── Approve
   └── Reject
        ↓
Maintenance History
```

---

# Key Features

## 1. Equipment Management

Equipment can be registered and associated with maintenance issues.

Each issue is linked to the equipment where the problem was detected.

---

## 2. Issue Reporting

Users can report equipment problems by providing information such as:

- Issue description
- Sensor readings
- Operating events
- Equipment information

Example:

```text
Equipment: Industrial Pump

Issue:
Abnormal vibration and unusual noise.

Operating Event:
Pump restarted twice after a power interruption.

Sensor Readings:
Vibration: High
Temperature: Normal
Pressure: High
```

---

## 3. Sensor Readings

Sensor data can be submitted with an issue for rule-based and AI analysis.

The backend validates the sensor readings before continuing with the analysis process.

```text
Sensor Data
     ↓
Validation
     ↓
Conflict Detection
     ↓
Rule Engine
```

---

## 4. Operating Events

Recent operating conditions or events can be recorded along with an issue.

Examples:

```text
Pump restarted twice after a power interruption.
```

```text
Equipment was running continuously for 18 hours.
```

These events are also included in the analysis process.

---

# AI-Powered Analysis

After an issue is created, the system performs an analysis process.

### Analysis Pipeline

```text
Issue
  ↓
Get Equipment
  ↓
Validate Sensor Readings
  ↓
Detect Sensor Conflicts
  ↓
Run Rule Engine
  ↓
Calculate Priority
  ↓
Search Maintenance Knowledge
  ↓
AI Analysis
  ↓
Save Analysis Results
```

The AI analysis can generate:

- Observations
- Possible causes
- Confirmed findings
- Follow-up questions
- Inspection steps
- Evidence
- Work Order information

---

# Rule Engine

The system does not rely only on AI.

Before calling the AI service, deterministic rules are executed against the sensor readings.

The rule engine:

1. Checks sensor conditions
2. Detects abnormal readings
3. Determines rule results
4. Calculates maintenance priority

Priority levels:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

This provides a deterministic layer before AI-based reasoning.

---

#  Knowledge Search

The system builds a search query using information such as:

```text
Equipment Type
+
Issue Description
+
Operating Events
```

This information is passed to the knowledge search layer before AI analysis.

---

# 🤖 AI Analysis

The AI service receives information including:

```text
Equipment
Issue
Rule Results
Knowledge Results
```

The AI then generates structured maintenance analysis.

The generated information is stored back in the Issue document.

---

#  Work Order Generation

After successful issue analysis, the system checks whether a Work Order already exists for the issue.

```text
Does Work Order exist?
        │
   ┌────┴────┐
   │         │
  YES        NO
   │         │
Return    Create Draft
Existing   Work Order
Work Order
```

A new Work Order contains:

- Issue ID
- Equipment ID
- Title
- Description
- Inspection Steps
- Priority
- Status

Initial status:

```text
DRAFT
```

---

# Work Order Workflow

The Work Order follows this lifecycle:

```text
DRAFT
  │
  ├── APPROVED
  │
  └── REJECTED
```

### Draft

The Work Order is created after successful issue analysis.

### Approved

A technician can approve a Draft Work Order.

```text
DRAFT → APPROVED
```

When approved, a record is also created in the Maintenance History.

### Rejected

A technician can reject a Draft Work Order and provide a technician note.

```text
DRAFT → REJECTED
```

Only Draft Work Orders can be edited, approved, or rejected.

---

# Maintenance History

When a Work Order is approved, the system creates a Maintenance History record containing information such as:

```text
Equipment
Issue
Work Order
Action
Description
```

This provides a historical record of maintenance activities.

---

# 🛠️ Tech Stack

## Frontend

- React
- JavaScript
- JSX
- CSS
- REST API integration

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## AI

- OpenAI API

## Development & Testing

- VS Code
- Postman
- Git
- GitHub

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

#  Project Structure

```text
Maint-AI/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   │   ├── issueController.js
│   │   └── workOrderController.js
│   │
│   ├── models/
│   │   ├── Issue.js
│   │   ├── Equipment.js
│   │   ├── WorkOrder.js
│   │   └── MaintenanceHistory.js
│   │
│   ├── routes/
│   │   ├── issueRoutes.js
│   │   └── workOrderRoutes.js
│   │
│   ├── services/
│   │   └── aiService.js
│   │
│   ├── ...
│   │
│   └── package.json
│
└── README.md
```

---

# Complete System Flow

The complete Maint-AI workflow is:

```text
                    ┌───────────────┐
                    │   Equipment   │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ Report Issue  │
                    └───────┬───────┘
                            ↓
              ┌──────────────────────────┐
              │ Sensor + Operating Data │
              └────────────┬─────────────┘
                           ↓
                  ┌─────────────────┐
                  │ Validate Sensor │
                  └────────┬────────┘
                           ↓
                 ┌───────────────────┐
                 │ Conflict Detection│
                 └─────────┬─────────┘
                           ↓
                    ┌────────────┐
                    │ Rule Engine│
                    └─────┬──────┘
                          ↓
                 ┌──────────────────┐
                 │ Priority Calculate│
                 └────────┬─────────┘
                          ↓
                  ┌────────────────┐
                  │Knowledge Search│
                  └───────┬────────┘
                          ↓
                    ┌───────────┐
                    │ AI Analysis│
                    └─────┬─────┘
                          ↓
                 ┌──────────────────┐
                 │ Save Issue Result│
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │ Draft Work Order │
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │Technician Review │
                 └────────┬─────────┘
                    ┌─────┴─────┐
                    ↓           ↓
               APPROVED      REJECTED
                    ↓
           Maintenance History
```

---

# 🔌 API Overview

## Issues

### Create Issue

```http
POST /api/issues
```

Creates a new maintenance issue.

---

### Get Issues

```http
GET /api/issues
```

Returns available issues.

---

### Analyze Issue

```http
POST /api/issues/:id/analyze
```

Runs the complete analysis pipeline.

The endpoint performs:

```text
Validation
→ Conflict Detection
→ Rule Engine
→ Priority Calculation
→ Knowledge Search
→ AI Analysis
→ Work Order Creation
```

---

# 📝 Work Order APIs

### Create Work Order

```http
POST /api/work-orders
```

Creates a Draft Work Order.

---

### Get Work Orders

```http
GET /api/work-orders
```

Returns all Work Orders.

---

### Get Work Order

```http
GET /api/work-orders/:id
```

Returns a specific Work Order.

---

### Update Work Order

```http
PUT /api/work-orders/:id
```

Only Draft Work Orders can be edited.

---

### Approve Work Order

```http
PATCH /api/work-orders/:id/approve
```

Changes:

```text
DRAFT → APPROVED
```

and creates a Maintenance History record.

---

### Reject Work Order

```http
PATCH /api/work-orders/:id/reject
```

Changes:

```text
DRAFT → REJECTED
```

A technician note can also be provided.

---

# 🧪 API Testing

The backend APIs are currently being tested using **Postman**.

Issue creation has been successfully tested through Postman.

Example testing flow:

```text
Postman
   ↓
Create Issue
   ↓
Issue stored in MongoDB
   ↓
Analyze Issue
   ↓
AI Analysis
   ↓
Create Draft Work Order
```

---

# ⚠️ Current AI API Limitation

The AI integration requires an active OpenAI API account with available API credits.

Currently, the OpenAI API account has **no remaining credits**, resulting in:

```text
429 — insufficient_quota
credit_balance_exhausted
```

Because the AI analysis is currently part of the Issue Analysis → Work Order generation flow, the process stops when the AI request fails.

Current status:

```text
Postman API Testing       ✅
Issue Creation            ✅
MongoDB Storage           ✅
Sensor/Rule Processing    ✅
AI Analysis               ⚠️ Requires API Credits
Work Order Auto-Creation  ⚠️ Blocked by AI failure
```

Once valid OpenAI API credits are available, the complete AI → Work Order flow can be tested.

---

# 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
```

> Never commit `.env` files or API keys to GitHub.

Add `.env` to `.gitignore`:

```gitignore
.env
node_modules/
```

---

# 💻 Local Setup

## 1. Clone Repository

```bash
git clone <your-repository-url>
cd Maint-AI
```

---

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

or:

```bash
yarn
```

---

## 3. Configure Environment Variables

Create:

```text
server/.env
```

and add the required environment variables.

---

## 4. Start Backend

```bash
npm start
```

or:

```bash
yarn start
```

---

## 5. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

---

## 6. Start Frontend

```bash
npm run dev
```

---

# 🚀 Deployment

## Backend

The backend can be deployed using **Render**.

Typical configuration:

```text
Root Directory:
server/

Build Command:
yarn

Start Command:
yarn start
```

Environment variables must be configured in the Render dashboard.

---

## Frontend

The React frontend can be deployed using **Vercel**.

Configure the frontend API URL using an environment variable, for example:

```env
VITE_API_URL=your_backend_url
```

---

# 🔒 Security

Important security practices:

- Keep API keys inside environment variables.
- Never commit `.env`.
- Never expose OpenAI API keys in frontend code.
- Use environment variables for database credentials.
- Validate incoming API data.
- Validate MongoDB ObjectIds before database queries.

---

# 📌 Current Development Status

| Feature | Status |
|---|---|
| Equipment Management | ✅ |
| Issue Creation | ✅ |
| Sensor Readings | ✅ |
| Operating Events | ✅ |
| Sensor Validation | ✅ |
| Sensor Conflict Detection | ✅ |
| Rule Engine | ✅ |
| Priority Calculation | ✅ |
| Knowledge Search | ✅ |
| AI Analysis | ⚠️ Requires API Credits |
| Work Order Model | ✅ |
| Work Order Creation Logic | ✅ |
| Work Order Update | ✅ |
| Technician Approval | ✅ |
| Technician Rejection | ✅ |
| Maintenance History | ✅ |
| Postman API Testing | ✅ |
| Backend Deployment | 🚧 |
| Frontend Deployment | 🚧 |

---

# 🎯 Future Improvements

Planned improvements may include:

- Real-time sensor integration
- Automated sensor data ingestion
- More maintenance rules
- Improved knowledge base
- AI-assisted inspection recommendations
- Technician dashboard
- Maintenance analytics
- Notifications and alerts
- Work Order assignment
- Maintenance scheduling
- Equipment health monitoring

---

# 👨‍💻 Project

**Maint-AI**

An AI-assisted predictive maintenance and work order management platform.

Built with:

```text
React
Node.js
Express.js
MongoDB
Mongoose
OpenAI API
Postman
Vercel
Render
```

---

## ⚠️ Development Note

The current project is under active development. Some parts of the AI-powered workflow depend on an active OpenAI API account with available credits.
