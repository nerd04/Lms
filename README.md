# WeLearn — A Modern Learning Management System (LMS)

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.17-green.svg?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**WeLearn** (GrowTogether) is a modern, high-performance, and visually stunning Learning Management System. Designed for the modern web, it provides a dual-portal experience that connects passionate **content creators (educators)** looking to share their expertise with **eager students** seeking structured, expert-led curriculums.

---

## 🎨 User Interface & Layout

Below are the mockups representing the core screens of the platform. *Replace these with actual screenshots of your running application before publishing to GitHub.*

### 🏠 Landing Page
*Welcome screen detailing platform Manifesto and the dual hubs (Creator Portal vs. Student Portal).*
![WeLearn Hero](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop)

### 📚 Enrolled Courses Catalog
*Student view showing curriculum grids, prices, and educator statistics.*
![Browse Courses](https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop)

### 📊 Educator Command Center
*Full management console for uploading video lectures, monitoring enrollment numbers, and editing course catalogs.*
![Educator Dashboard](https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop)

---

## ⚡ Core Features

- **Dual Portal Design**:
  - **Educators**: Access an analytics overview (courses, students, projections), edit drafts, toggle publishing status, and upload video lectures (with progress loading feedback).
  - **Students**: Search published catalogs, view course curricula, watch free previews, enroll in a click, and stream course videos on a clean player.
- **Dynamic Localhost Fallback**: Auto-detects local hostnames to bypass production `.env` URLs, eliminating connection conflicts in local development.
- **Secure Authentication**: Traditional credentials & Google OAuth login, backed by environment-aware HttpOnly cookie tokens.
- **Cloud-Synced Assets**: Integrated with Multer and Cloudinary API for on-the-fly thumbnail resizing and video rendering.

---

## 🛠️ Technology Stack

| Layer | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Redux Toolkit, Tailwind CSS v4, Framer Motion, React-Router-dom | Glassmorphic layouts, modular states, responsive layouts, and slide-in animations. |
| **Backend** | Node.js, Express (ESM modules), JWT | Serverless function ready, secure cookie parser, and middleware protections. |
| **Database** | MongoDB, Mongoose | Complex schemas, schema validations, and population routes. |
| **Storage** | Multer, Cloudinary | Local multi-part storage handling and API content CDN uploads. |
| **Mailing** | Nodemailer | Gmail SMTP configurations for secure password resets OTP. |

---

## 🚀 Local Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster account
- Cloudinary developer account
- Firebase project credentials (for OAuth)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/welearn.git
cd welearn
```

### 2. Configure Backend environment
Navigate to `server/` and create a `.env` file:
```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_signature_secret
USER_EMAIL=gmail_address_for_otp
USER_PASSWORD=gmail_app_password
CLOUDINARY_NAME=cloudinary_cloud_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secret
```
Install dependencies and run:
```bash
cd server
npm install
npm run dev
```

### 3. Configure Frontend environment
Navigate to `client/` and create a `.env` file:
```env
VITE_FIREBASE_APIKEY=your_firebase_web_api_key
VITE_REACT_APP_BACKEND_BASE_URL=https://your-production-backend-domain.vercel.app/
```
Install dependencies and run:
```bash
cd ../client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Deployment

This project is configured for seamless deployment on **Vercel** serverless functions:
- **Server Deployment**: Configured via the server's [vercel.json](server/vercel.json) file to map Express function endpoints. Add environment variables during setup.
- **Client Deployment**: Vite builds are mapped automatically via the client's [vercel.json](client/vercel.json) redirects.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
