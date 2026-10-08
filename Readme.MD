# Interview AI ⚡

<p align="left">
  <a href="https://interview-ai-07n8.onrender.com"><img src="https://img.shields.io/badge/Demo-Live%20on%20Render-brightgreen?style=flat-square&logo=render" alt="Live Demo" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" alt="React" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js" alt="Node.js" /></a>
  <a href="https://aistudio.google.com/"><img src="https://img.shields.io/badge/Google%20Gemini-GenAI%20SDK-4285F4?style=flat-square&logo=google" alt="Google Gemini" /></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" alt="MongoDB" /></a>
</p>

An AI-powered full-stack interview preparation platform that analyzes your resume and self-description against a target job description to generate a personalized interview strategy—complete with question-answer preparation, intent breakdowns, skill-gap analysis, and a structured 7-day action plan. It also includes an AI-powered resume builder that generates job-tailored, ATS-friendly resume PDFs.

🌐 **Live Demo:** [https://interview-ai-07n8.onrender.com](https://interview-ai-07n8.onrender.com)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started Locally](#getting-started-locally)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Deployment (Render)](#deployment-render)
- [API Reference](#api-reference)
- [Application Flow](#application-flow)
- [Contributing](#contributing)
- [License](#license)

---

## 💡 Overview

Preparing for technical and behavioral interviews can be overwhelming without tailored feedback. **Interview AI** leverages **Google Gemini AI** to bridge the gap between candidate qualifications and specific job requirements:

- 🎯 **Match Score:** Calculates a 0–100% compatibility rating between your profile and target job.
- 💻 **Technical Questions:** Generates 4–5 role-specific questions with interviewer intent and ideal responses.
- 🤝 **Behavioral Questions:** Generates 2–3 situational/behavioral questions with structured answer guidelines.
- ⚠️ **Skill Gap Analysis:** Highlights missing competencies rated by severity (`low`, `medium`, `high`).
- 📅 **7-Day Preparation Roadmap:** Delivers a day-by-day study schedule with actionable focus areas.
- 📄 **ATS Resume Generator:** Uses Gemini & Puppeteer to dynamically create a tailored, downloadable A4 PDF resume.

---

## ✨ Key Features

### 🔐 Authentication & Session Security

- User registration and login with bcrypt-hashed passwords.
- Secure, stateless JWT authentication stored in **HTTP-only cookies**.
- Server-side token blacklisting on logout to prevent replay attacks.
- Frontend route guards (`<Protected>`) with persistent session restoration.

### 📋 Intelligent Interview Reports & Input Experience

- **Resume Upload with Live Status:** Interactive dropzone with click-to-upload and native drag-and-drop, real-time status badge (`Not uploaded` vs. glowing `● Uploaded`), file name preview with size indicator, and instant file removal.
- **Dynamic Character Limiter:** Target job description input tracks character count live with strict 5,000-character enforcement.
- **Combined Context Analysis:** Integrates both uploaded resumes (parsed via `pdf-parse`) and user self-descriptions to build a rich candidate profile.
- **Schema-Validated AI Responses:** Structured output guarantee via **Zod** and Google Gen AI SDK.
- **History Dashboard:** Instant access to previously generated interview strategies stored in MongoDB Atlas.

### 📄 Job-Tailored Resume PDF Export

- **Custom-Tailored Content:** Prompts Gemini to tailor resume sections specifically around the target job description while maintaining human-like, ATS-friendly phrasing.
- **Multi-Tier Browser Launch:** Pre-configured headless **Puppeteer** engine with automatic fallbacks (system Google Chrome, bundled Chromium, and Microsoft Edge) with sandbox arguments for bulletproof execution across Windows, macOS, and Linux cloud environments.
- **ATS-Optimized Formatting:** Converts semantic, structured HTML into a print-ready A4 PDF with standardized margins and keyword alignment designed to pass Applicant Tracking Systems without layout distortion.

---

## 🛠 Tech Stack

### Frontend

- **Framework:** React 19 + Vite 8
- **Routing:** React Router v8
- **Styling:** SCSS (Sass)
- **HTTP Client:** Axios (dynamic baseURL for local development & production)

### Backend

- **Runtime & Server:** Node.js + Express 5
- **Database & ODM:** MongoDB Atlas + Mongoose 9
- **Authentication:** JSON Web Tokens (JWT) + Cookie-Parser + bcryptjs
- **File Upload & Parsing:** Multer + pdf-parse
- **AI Integration:** `@google/genai` (Google Gemini 3.5 Flash Lite — `gemini-3.5-flash-lite`) + Zod
- **PDF Generation:** Puppeteer 25 (with Chrome & Edge channel fallbacks)

---

## 📁 Project Architecture

```
INTERVIEW-AI/
├── backend/
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   ├── controllers/         # Auth & interview business logic
│   │   ├── middlewares/         # JWT verification & Multer file upload
│   │   ├── models/              # Mongoose schemas (User, Report, Blacklist)
│   │   ├── routes/              # Express API endpoints
│   │   ├── services/            # Gemini AI service & Puppeteer PDF generator
│   │   └── app.js               # Express application & SPA static serving
│   ├── .puppeteerrc.cjs         # Puppeteer Chrome cache configuration
│   ├── package.json
│   └── server.js                # Server entry point
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/            # Auth context, hooks, login & register pages
│   │   │   └── interview/       # Interview hooks, context, Home & Report pages
│   │   ├── style/               # Button and design system styles
│   │   ├── App.jsx
│   │   ├── app.routes.jsx       # Route configuration & route guards
│   │   ├── main.jsx
│   │   └── style.scss           # Global styles and animated loading keyframes
│   ├── public/                  # Assets and favicon
│   ├── vite.config.js
│   └── package.json
├── .puppeteerrc.cjs             # Root Puppeteer configuration
├── package.json                 # Monorepo build and start scripts
└── Readme.MD
```

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance (Local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Google Gemini API Key ([Get one here](https://aistudio.google.com/apikey))
- Google Chrome or Microsoft Edge installed on your system (or run `npx puppeteer browsers install chrome`)

### 1. Clone the Repository

```bash
git clone https://github.com/Piyush-Sarkar/Interview-AI.git
cd Interview-AI
```

### 2. Backend Setup

1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file inside `backend/`:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 🌐 Deployment (Render)

This repository is pre-configured to build the frontend and serve both the API and client from a **single Node.js process** in production.

### Root Commands

- **Build Command:**

  ```bash
  npm run build
  ```

  *(Installs backend & frontend dependencies, builds the Vite production bundle, and downloads Chrome for Puppeteer)*
- **Start Command:**

  ```bash
  npm start
  ```

### Render Configuration

1. Create a new **Web Service** on [Render](https://dashboard.render.com).
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory:** *(leave blank)*
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Add the following **Environment Variables**:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = *your MongoDB Atlas connection URI*
   - `JWT_SECRET` = *your JWT secret key*
   - `GOOGLE_GENAI_API_KEY` = *your Google Gemini API key*

---

## 📡 API Reference

### Authentication Endpoints

| Method   | Endpoint               | Access  | Description                                |
| -------- | ---------------------- | ------- | ------------------------------------------ |
| `POST` | `/api/auth/register` | Public  | Register a new user account                |
| `POST` | `/api/auth/login`    | Public  | Authenticate user & issue HTTP-only cookie |
| `GET`  | `/api/auth/logout`   | Public  | Blacklist token & clear cookie             |
| `GET`  | `/api/auth/get-me`   | Private | Fetch authenticated user profile           |

### Interview & Report Endpoints

| Method   | Endpoint                                         | Access  | Description                                                    |
| -------- | ------------------------------------------------ | ------- | -------------------------------------------------------------- |
| `POST` | `/api/interview`                               | Private | Generate structured interview report (`multipart/form-data`) |
| `GET`  | `/api/interview`                               | Private | Fetch all interview reports for the current user               |
| `GET`  | `/api/interview/report/:interviewId`           | Private | Fetch full report details by ID                                |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Private | Generate and download tailored ATS resume PDF                  |

---

## 🔄 Application Flow

```
1. Register / Login
        ↓
2. Home Dashboard
   - View previously generated interview reports
   - Upload resume PDF (with live status feedback & drag-and-drop)
   - Add self-description & enter target job description (live 5k character counter)
        ↓
3. AI Strategy Generation
   - Full-page wave animated loading screen ("Loading your interview plan.....")
   - Evaluates profile compatibility & calculates match score
   - Identifies technical & behavioral questions with intentions & model answers
   - Maps out skill gaps and a 7-day preparation schedule
        ↓
4. Report Detail View (/interview/:id)
   - Interactive preparation tabs (Technical, Behavioral, Roadmap)
   - Sidebar with Match Score and severity-coded skill gaps
        ↓
5. AI Resume Download
   - Full-page wave animated loading screen ("Downloading your resume.....")
   - Headless Puppeteer renders job-optimized resume into an A4 PDF
   - Download is verified before cleanly returning user to the report dashboard
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.
