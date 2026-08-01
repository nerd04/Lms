# GrowTogether — Collaborative Peer Learning Platform

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.17-green.svg?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**GrowTogether** (formerly WeLearn) is a modern, high-performance, and visually stunning Learning Management System. Built with React 19, Express, MongoDB, and Tailwind CSS v4, it introduces a dynamic knowledge-exchange ecosystem. The platform breaks the binary barrier between teaching and learning, allowing users to transition seamlessly between sharing expertise and acquiring new skills.

---

## 🎨 Design Philosophy & Theme Psychology

The user interface of GrowTogether is designed around a core learning philosophy:
> **"You know nothing, even if you know everything."**
> *The world is full of knowledge. Everyone is a learner in this world, and the moment you believe you have nothing left to learn is the moment you stop growing.*

### 🌈 Visual Design (Alabaster Slate & Royal Indigo)
*   **Canvas Background (`#faf9f5`)**: Warm alabaster base creating a soft, premium background that reduces eye strain and emphasizes typography.
*   **Action Highlights (`#4f46e5`)**: Royal Indigo buttons and active states providing clean focus points.
*   **Metallic Shimmer (`.black-shining-text`)**: Key hero titles feature a keyframe-driven shining gradient animation for a professional touch.
*   **Glassmorphic Navbars**: Frosted overlays (`bg-white/70 backdrop-blur-md`) with high-contrast active states.

---

## ⚡ Key Features

*   **🔄 Dynamic Role-Switching**:
    *   Switch between **Student** and **Educator** roles directly from your profile settings.
    *   **Enrolment & Creation History Preservation**: Educators can become students to learn where they lack skills without losing their created course catalog. Students can switch to educators to teach what they know best.
*   **📂 Interactive Course Management**:
    *   **For Educators**: SaaS-style command center tracking student enrollment statistics, easy lecture upload steps with progress loading feedback, and drafts publishing controls.
    *   **For Students**: Course details layout with video player previews, curriculum lock states for paid content, and search query filters.
*   **🔒 Secure Role-Based Authorization**:
    *   Strict ownership guards verify requesting educator IDs before processing updates, additions, or deletions of course assets.
    *   HttpOnly cookie-based JWT sessions with automated development localhost fallback.
*   **☁️ Cloud Asset Streaming**:
    *   On-the-fly multi-part file parsing using Multer, connected to Cloudinary API for optimized thumbnail and video delivery.

---

## 🛠️ Technology Stack

| Layer | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Redux Toolkit, Tailwind CSS v4, Framer Motion, React-Router-dom | State slices, responsive layout parameters, spring animations, and card transformations. |
| **Backend** | Node.js, Express (ESM modules), JWT | Secure cookie parser, role routing middleware, and content ownership validation. |
| **Database** | MongoDB, Mongoose | Schema validation models for Course, User, and Lectures. |
| **Storage** | Multer, Cloudinary API | Multi-part form parsing and secure CDN content delivery. |
| **Mailing** | Nodemailer | Password recovery OTP delivery via SMTP. |

---

## 🚀 Local Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary developer API credentials
- Firebase web credentials (for Google Sign-In)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/growtogether.git
cd growtogether
```

### 2. Set Up the Server
Navigate to the `server/` directory, create a `.env` file, and populate the following keys:
```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_signature_secret
USER_EMAIL=gmail_address_for_nodemailer_otp
USER_PASSWORD=gmail_app_password
CLOUDINARY_NAME=cloudinary_cloud_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secret
```
Install dependencies and boot the backend server in development mode:
```bash
cd server
npm install
npm run dev
```

### 3. Set Up the Client
Navigate to the `client/` directory, create a `.env` file, and populate the Firebase connection keys:
```env
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_REACT_APP_BACKEND_BASE_URL=http://localhost:3000
```
Install dependencies and run the client dev server:
```bash
cd ../client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Deployment Configuration

This project is optimized for deployment on **Vercel**:
*   **Express Server API**: Mapped via the server's [vercel.json](server/vercel.json) configuration using Vercel serverless routes.
*   **Vite React SPA Client**: Rewrites client assets and paths using the client's [vercel.json](client/vercel.json) mapping rule.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
