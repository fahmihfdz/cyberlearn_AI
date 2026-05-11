# 🛡️ CyberLearn AI

CyberLearn AI is a modern, bilingual (English & Indonesian), AI-powered web platform designed to help beginners and professionals learn cybersecurity concepts, ethical hacking, and defensive security. 

Powered by the **Google Gemini API**, it serves as a 24/7 personal mentor that generates interactive learning paths, quizzes, and summaries on-demand.

---

## ✨ Key Features

- **Bilingual Support (EN & ID):** Fully translated UI with a modern seamless language toggle switcher.
- **Smart Learning Dashboards:** Track learning progress, passed quizzes, and AI interaction activity scores.
- **AI Chat Assistant:** Ask any cybersecurity question and get beginner-friendly explanations with practical examples.
- **Roadmap Generator:** Generate a step-by-step learning path tailored to specific career goals (e.g., Penetration Tester, Malware Analyst) and current skill levels.
- **Quiz Generator:** Test your knowledge instantly with AI-generated quizzes on various security topics. Earn points for correct answers!
- **PDF & Text Summarizer:** Upload long security whitepapers (`.pdf` or `.txt`) or paste long texts to receive concise, structured AI summaries.
- **Secure Authentication:** Built-in Firebase Authentication supporting Email/Password and Google Sign-In.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Framer Motion (for micro-animations and smooth page transitions)
- **Icons:** Lucide React
- **Internationalization (i18n):** react-i18next
- **Routing:** React Router DOM

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **AI Integration:** Google Gemini API (`@google/genai`)
- **File Parsing:** `multer`, `pdf-parse` (for parsing PDF uploads)
- **Middleware:** CORS, Express JSON parser

### **Database & Auth**
- **Provider:** Firebase (Authentication + Cloud Firestore)

---

## 📂 Project Structure

```text
CyberLearn_AI/
├── backend/                  # Express Node.js Server
│   ├── server.js             # Main server logic & Gemini integration
│   ├── package.json          
│   └── .env                  # Backend environment variables
│
└── frontend/                 # React UI Client
    ├── src/
    │   ├── assets/           # Images, Logos
    │   ├── components/       # Reusable UI (Sidebar, Layout, LanguageSwitcher)
    │   ├── locales/          # i18n JSON dictionaries (en.json, id.json)
    │   ├── pages/            # App Views (Dashboard, Quiz, Auth, etc.)
    │   ├── firebase.js       # Firebase SDK initialization
    │   ├── i18n.js           # react-i18next configuration
    │   ├── App.jsx           # Main App Routing
    │   └── main.jsx          # React DOM render entry
    ├── tailwind.config.js    # Tailwind themes & colors
    ├── package.json          
    └── .env                  # Frontend environment variables
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Firebase Project (Authentication & Firestore enabled)
- Google Gemini API Key (from Google AI Studio)

### 2. Backend Setup
1. Open terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory and add your Gemini API Key:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory and add your Firebase config keys:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 4. Open Application
Navigate to `http://localhost:5173` in your browser.

---

## 🎨 Design System
The platform utilizes a "Dark SaaS" aesthetic tailored for cybersecurity:
- **Primary Color (Cyan):** Represents trust, technology, and futuristic UI.
- **Secondary Color (Green/Neon):** Represents success, verification, and hacker terminal accents.
- **Background:** Deep dark colors (`#0f172a`, `#000000`) with glassmorphism effects (`backdrop-blur`).
