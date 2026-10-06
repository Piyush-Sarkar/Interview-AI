# Interview-AI

An AI-powered full-stack interview preparation platform that analyzes your resume against a job description and generates a personalized interview strategy—complete with questions, answers, skill-gap analysis, and a 7-day preparation plan. It also includes an AI-powered resume generation feature to help create optimized, job-specific resumes.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [Application Flow](#application-flow)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## Overview

Interview-AI helps job seekers prepare smarter for interviews by combining resume parsing, job description analysis, and Google Gemini AI. Given a resume and a target job description, the app generates:

- A **match score** (0–100) between your profile and the job
- **4–5 technical interview questions** with the interviewer's intent and ideal answers
- **2–3 behavioral interview questions** with context and guidance
- A list of **skill gaps** with severity ratings (`low` / `medium` / `high`)
- A **7-day structured preparation plan** with daily focus areas and tasks
- An AI-generated, **ATS-friendly resume PDF** tailored to the target job description

---

## Tech Stack

### Backend

| Technology               | Version   | Purpose                                       |
| ------------------------ | --------- | --------------------------------------------- |
| Node.js + Express        | 5.x       | REST API server                               |
| MongoDB + Mongoose       | 9.x       | Database & ODM                                |
| JWT + cookie-parser      | —        | Stateless auth with HTTP-only cookie sessions |
| bcryptjs                 | 3.x       | Password hashing                              |
| Multer                   | 2.x       | Resume PDF file uploads                       |
| pdf-parse                | 2.x       | PDF text extraction                           |
| `@google/genai`        | 2.x       | Google Gemini AI integration                  |
| Zod + zod-to-json-schema | 4.x / 3.x | Schema validation & structured AI output      |
| Puppeteer                | 25.x      | HTML-to-PDF resume rendering                  |
| nodemon                  | —        | Dev server auto-restart                       |

### Frontend

| Technology   | Version | Purpose                                   |
| ------------ | ------- | ----------------------------------------- |
| React        | 19.x    | UI framework                              |
| Vite         | 8.x     | Build tool & dev server                   |
| React Router | 8.x     | Client-side routing with protected routes |
| Axios        | 1.x     | HTTP client                               |
| SCSS (Sass)  | 1.x     | Component-level styling                   |

---

## Features

### Authentication

- **Register** — create a new user account with hashed password storage
- **Login** — authenticate with email and password; JWT stored in an HTTP-only cookie
- **Logout** — token is server-side blacklisted (`blacklist.model.js`) to prevent reuse
- **Protected Routes** — `authMiddleware` on the backend and a `<Protected>` wrapper component on the frontend
- **Get Current User** — `/api/auth/get-me` returns the authenticated user's profile

### Interview Report Generation

- Upload a **resume PDF** — text is extracted server-side via `pdf-parse`
- Optionally provide a **self-description** as a supplement or alternative to a PDF
- Provide the **target job description**
- Gemini AI analyzes all inputs and returns a structured JSON report validated with Zod
- Report is **persisted in MongoDB** and linked to the authenticated user
- **Dashboard (Home page)** lists all past reports for the user (summary view — no large fields)
- **Report detail page** (`/interview/:interviewId`) shows the full report

### AI-Powered Resume PDF Export

- Triggered via `POST /api/interview/resume/pdf/:interviewReportId`
- Gemini generates an ATS-friendly, professionally styled HTML resume tailored to the job
- **Puppeteer** renders the HTML and streams a downloadable **A4 PDF** back to the client

---

## Project Structure

```
INTERVIEW-AI/
├── Backend/
│   ├── src/
│   │   ├── config/                    # Database connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # Register, login, logout, get-me
│   │   │   └── interview.controller.js # Report CRUD + PDF generation
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js     # JWT verification
│   │   │   └── file.middleware.js     # Multer (PDF upload)
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── interviewReport.model.js
│   │   │   └── blacklist.model.js     # Logout token blacklist
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   ├── services/
│   │   │   └── ai.service.js          # Gemini AI + Puppeteer PDF logic
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/        # <Protected> route wrapper
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── Login.jsx
│   │   │   │   │   └── Register.jsx
│   │   │   │   └── services/          # Auth API calls
│   │   │   └── interview/
│   │   │       ├── hooks/
│   │   │       ├── pages/
│   │   │       │   ├── Home.jsx       # Dashboard & report list
│   │   │       │   └── Interview.jsx  # Full report detail view
│   │   │       ├── services/          # Interview API calls
│   │   │       └── style/
│   │   ├── App.jsx
│   │   ├── app.routes.jsx             # React Router config
│   │   ├── main.jsx
│   │   └── style.scss
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── Readme.MD
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Backend Setup

1. Navigate into the `Backend` folder and install dependencies:

```bash
cd Backend
npm install
```

2. Create a `.env` file inside `Backend/`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
```

3. Start the development server:

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

---

### Frontend Setup

1. Navigate into the `Frontend` folder and install dependencies:

```bash
cd Frontend
npm install
```

2. Start the development server:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

---

## API Reference

### Auth Endpoints

| Method   | Endpoint               | Access  | Description                            |
| -------- | ---------------------- | ------- | -------------------------------------- |
| `POST` | `/api/auth/register` | Public  | Register a new user                    |
| `POST` | `/api/auth/login`    | Public  | Login and receive a JWT cookie         |
| `GET`  | `/api/auth/logout`   | Public  | Logout and blacklist the current token |
| `GET`  | `/api/auth/get-me`   | Private | Get the currently authenticated user   |

### Interview Endpoints

| Method   | Endpoint                                         | Access  | Description                                 |
| -------- | ------------------------------------------------ | ------- | ------------------------------------------- |
| `POST` | `/api/interview`                               | Private | Generate a new interview report             |
| `GET`  | `/api/interview`                               | Private | List all reports for the logged-in user     |
| `GET`  | `/api/interview/report/:interviewId`           | Private | Fetch a specific report by ID               |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Private | Generate and download a tailored resume PDF |

#### `POST /api/interview` — Request Body (`multipart/form-data`)

| Field               | Type       | Required | Description                       |
| ------------------- | ---------- | -------- | --------------------------------- |
| `resume`          | File (PDF) | Yes      | The candidate's resume            |
| `selfDescription` | String     | Optional | Extra context about the candidate |
| `jobDescription`  | String     | Yes      | The target job description        |

#### Interview Report Schema

```json
{
  "title": "string",
  "matchScore": 0,
  "technicalQuestions": [
    { "question": "string", "intention": "string", "answer": "string" }
  ],
  "behavioralQuestions": [
    { "question": "string", "intention": "string", "answer": "string" }
  ],
  "skillGaps": [
    { "skill": "string", "severity": "low | medium | high" }
  ],
  "preparationPlan": [
    { "day": 1, "focus": "string", "tasks": ["string"] }
  ]
}
```

> **AI constraints:** 4–5 technical questions, 2–3 behavioral questions, exactly 7 preparation days.

---

## Application Flow

```
1.  Register / Login
         ↓
2.  Dashboard (Home page)
    - View list of all past interview reports
         ↓
3.  Create New Report
    - Paste the job description
    - Upload a resume PDF (and/or provide a self-description)
    - Submit → AI generates and stores the report
         ↓
4.  View Report Detail (/interview/:id)
    - Match score
    - Technical questions with intentions and answers
    - Behavioral questions with guidance
    - Skill gap analysis with severity levels
    - 7-day preparation plan
         ↓
5.  Download Resume PDF (optional)
    - AI generates a tailored, ATS-friendly HTML resume
    - Rendered to PDF via Puppeteer and downloaded
```

---

## Development

### Building the Frontend

```bash
cd Frontend
npm run build
```

The production bundle is output to `Frontend/dist/`.

### Linting

```bash
cd Frontend
npm run lint
```

### Previewing the Production Build

```bash
cd Frontend
npm run preview
```

---

## Troubleshooting

### MongoDB Connection Issues

- Verify your `MONGO_URI` is correct in `Backend/.env`
- Ensure your MongoDB server is running locally, or that your Atlas cluster is active
- If using MongoDB Atlas, whitelist your current IP address under **Network Access**
- Test the connection string independently with [MongoDB Compass](https://www.mongodb.com/products/compass)

### Google Gemini API Errors

- Confirm `GOOGLE_GENAI_API_KEY` is set correctly in `Backend/.env`
- Make sure the key has access to the **Gemini** models via [Google AI Studio](https://aistudio.google.com/apikey)
- If you get a quota or rate-limit error, check your usage limits in the Google Cloud Console
- The app uses `gemini-3.1-flash-lite` — ensure this model is available on your API key

### PDF Generation Issues (Puppeteer)

- Puppeteer downloads a bundled Chromium on `npm install` — ensure you have enough disk space
- On Linux/CI environments, you may need to install additional system dependencies:
  ```bash
  apt-get install -y libgbm-dev libxshmfence-dev
  ```
- If PDF generation hangs, check that `puppeteer.launch()` can open a headless browser in your environment

### Resume Upload Fails

- Only **PDF** files are accepted; verify the file extension and MIME type
- Check that `multer` is properly configured in `Backend/src/middlewares/file.middleware.js`
- Ensure the request uses `multipart/form-data` encoding, not `application/json`

### CORS Errors

- Ensure the backend CORS configuration in `Backend/src/app.js` allows requests from `http://localhost:5173`
- If deploying, update the allowed origin to match your frontend's production URL
- Clear browser cache and hard-reload after making CORS changes

### Port Already in Use

- Change `PORT` in `Backend/.env` (default: `3000`)
- Kill the process occupying the port:
  - **Mac/Linux:** `lsof -ti:3000 | xargs kill -9`
  - **Windows:** `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`

### JWT / Authentication Errors

- Verify `JWT_SECRET` is set in `Backend/.env` and matches between restarts
- Tokens are stored as HTTP-only cookies — ensure your API client includes cookies with requests
- If a token is blacklisted after logout, you must log in again to get a new one

---

## Future Enhancements

- [ ] Mock interview session with real-time AI feedback
- [ ] Profile and account management page
- [ ] Admin dashboard and usage analytics
- [ ] Richer report UI with charts and progress tracking
- [ ] Deployment setup (Docker, Vercel, Render)
- [ ] Email notifications and shareable report links
- [ ] Support for DOCX and plain-text resume formats
- [ ] Dark mode UI
- [ ] Export interview report to PDF

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create a feature branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add YourFeatureName'
   ```
4. **Push to your branch**
   ```bash
   git push origin feature/YourFeatureName
   ```
5. **Open a Pull Request** against the `main` branch

Please make sure your code:

- Follows the existing project structure and naming conventions
- Does not commit `.env` files or secrets
- Includes relevant comments for non-obvious logic

---

## License

This project is currently open source and available under the **ISC License**.

---

## Support

For support, please open an issue in the repository or contact the development team.
