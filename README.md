# 🏋️ FitQuest – Gamified Fitness Tracker

FitQuest is a full-stack web application that gamifies your fitness journey by integrating directly with **Google Fit**. Users can track real-time activity data, set daily goals, and view progress through engaging, responsive dashboards.

---

## 🚀 Features

- 🔐 **Google OAuth Login** – Seamless sign-in using your Google account
- 📊 **Google Fit API Integration** – Tracks daily steps, calories, distance, and more
- 📈 **Live Stats Dashboard** – Displays fitness metrics in real-time
- 🏆 **Gamification Mechanics** – Users can challenge others putting tokens in stake which can be cashed out  
- 📆 **Daily Goals & Progress Bars** – Helps users stay accountable
- 🧘 **Clean, Responsive UI** – Built using Tailwind CSS and Material UI

---

## 🛠️ Tech Stack

### 💻 Frontend
- [React.js](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material UI](https://mui.com/)
- [Google OAuth (via `@react-oauth/google`)](https://www.npmjs.com/package/@react-oauth/google)

### 🌐 Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB (with Mongoose)](https://mongoosejs.com/)
- [Google Fit REST API](https://developers.google.com/fit/rest)

---

## 🔐 Authentication Flow

1. User signs in via Google OAuth
2. Access token is securely passed to the backend
3. Backend queries Google Fit API to fetch fitness data
4. Data is aggregated, stored in MongoDB, and returned to frontend
