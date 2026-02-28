# Discover.AI - Product Discovery Experience

A full-stack, AI-augmented product discovery web application. This project allows users to browse a modern catalog of tech and lifestyle products and utilize an LLM-powered natural language search to find exactly what they are looking for.

## ✨ Features Implemented
*   **Backend REST API (Node/Express):**
    *   `GET /api/products`: Returns a catalog of 8 structured tech products.
    *   `POST /api/ask`: Secure AI endpoint that accepts a natural language query, passes the catalog context to an LLM (via OpenRouter), and returns deterministically matched product IDs and a summarized response.
*   **Responsive Frontend (React/Vite):**
    *   Dynamic Product Grid with optimized, lazy-loaded external images.
    *   "Ask AI" natural language search input that triggers the `POST /api/ask` route.
    *   Custom Light/Dark theme toggle.
*   **Authentication & Security (Bonus):**
    *   Google OAuth 2.0 Integration via Passport.js.
    *   Secure Session handling. The AI assistant is protected and requires users to be signed in.
*   **Configuration:**
    *   Centralized environment variables for Backend URL routing and API keys inside a `.env` architecture.

---

## 🚀 Setup & Run Instructions (Local)

### Prerequisites
*   Node.js (v18+)
*   API Keys required: `OPENROUTER_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### 1. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `/backend` root:
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:5173
   BACKEND_URL=http://localhost:5000
   OPENROUTER_API_KEY=your_key_here
   GOOGLE_CLIENT_ID=your_google_id_here
   GOOGLE_CLIENT_SECRET=your_google_secret_here
   ```
4. Start the server: `npm run dev` (Runs on http://localhost:5000)

### 2. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev` (Runs on http://localhost:5173)

---

## 🌍 Deployment Guide
This project is configured for cloud deployment (e.g., Backend on Render, Frontend on Vercel).

**Backend Deployment (e.g., Render):**
1. Connect your GitHub repo and select the `/backend` folder.
2. Add your environment variables (`OPENROUTER_API_KEY`, `GOOGLE_CLIENT*`).
3. Set `CLIENT_URL` to your future frontend domain.
4. Set `BACKEND_URL` to your Render domain (e.g., `https://my-api.onrender.com`).
5. **Important:** Add your new `https://my-api.onrender.com/auth/google/callback` URL to your Google Cloud Console Authorized Redirect URIs.

**Frontend Deployment (e.g., Vercel):**
1. Connect your GitHub repo and select the `/frontend` folder.
2. In the Environment Variables section, add:
   *   `VITE_API_BASE_URL` = `https://my-api.onrender.com` (Your deployed backend URL).

---

*Time Spent: ~3.5 hours*
