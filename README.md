# Insight: Reflective Journaling

A journaling application focusing on mental health, mood tracking, AI-driven sentiment analysis, and a fluid, calming user interface inspired by calming meditative visuals and design.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [API Documentation](#api-documentation)
   - [Auth Endpoints](#auth-endpoints-if-implementing-auth)
   - [Entries Endpoints](#entries-endpoints)
   - [Tags Endpoints](#tags-endpoints)
   - [Goals Endpoints](#goals-endpoints)
   - [Entry-Goals Linking (Optional)](#entry-goals-linking-optional)
   - [Milestones Endpoints](#milestones-endpoints)
7. [Database Schema](#database-schema)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)

## 1. Introduction

Insight: Reflective Journaling is designed to help users track their daily thoughts, moods, and goals. Built with an emphasis on a smooth, calming UI/UX, it allows individuals to organize their reflections, visualize progress, and leverage AI sentiment analysis for deeper insights.

Insight: Reflective Journaling aims to provide a calming, fluid interface for tracking your daily reflections. It enables users to create journal entries, categorize them with tags, set goals, track milestones, and optionally leverage AI services for sentiment analysis. The fluid design and subtle animations support a tranquil, mindful experience.

## 2. Features

- **Journaling (Entries)**: Create, view, update, and delete personal entries.
- **Tags**: Categorize entries with multiple tags (many-to-many).
- **Goals & Milestones**: Define goals and track key milestones. Entries can be linked to goals for better tracking.
- **User Authentication**: Secure login and registration (JWT-based or similar).
- **AI Sentiment Analysis**: Integrate with IBM Watson or another NLP service.
- Each journal entry automatically undergoes sentiment evaluation (e.g., “Positive,” “Negative,” etc.), powered by a secure server-side AI integration.
- Results can be stored with your entry, allowing you to reflect on changes in mood or sentiment over time.
- **Responsive & Fluid UI**: Motions/animations using Framer Motion + Tailwind transitions.
- **Weather & Moon Phase**: Store and display weather/moon data in each entry for historical reference.

## 3. Technologies Used

### Frontend

- **React** (JavaScript)
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Zustand** for lightweight state management
- **p5.js** (optional, future) for meditative / soothing animations

### Backend

- **Python Flask** for RESTful APIs
- **PostgreSQL** for relational data storage
- **SQLAlchemy** ORM for database interactions
- **JWT** (token-based authentication)
- **AWS S3** (optional, future) for image/file uploads

## 4. Installation

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/tuckervbos/insight-reflective-journaling
   ```
2. **Backend Setup**:
   ```bash
   cd backend
   ```
3. **Create & Activate** a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate   # Mac/Linux
   # or
   venv\Scripts\activate.bat  # Windows
   ```
4. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
5. **Set Environment Variables** (in a .env file or system vars):
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database_name>
   JWT_SECRET_KEY=some_secret_key
   AWS_ACCESS_KEY_ID=<your_aws_key> # if using S3
   AWS_SECRET_ACCESS_KEY=<your_aws_secret> # if using S3
6. **Initialize/Run Migrations** (if using Flask-Migrate or similar):
   ```bash
   flask db init
   flask db migrate -m 'message'
   flask db upgrade
   flask seed all
   ```
7. **Start the Flask Server**:
   ```bash
   flask run
   ```
8. **Frontend Setup**:
   _navigate to frontend folder_:
   ```bash
   cd ../frontend
   ```
   _install dependencies_:
   ```bash
   npm install
   ```
   _create a .env file for any frontend environment variables_
   _start the development server_:
   ```bash
   npm run dev
   ```
   _access the app_ at http://localhost:3000.

## 5. Usage

1. Register a new user account or Log in with existing credentials.

2. Create a New Entry:
   • Fill out your entry title and body. Optionally, attach photos, select tags, or link goals.
   • (AI Sentiment Analysis): When you save, the text is sent to the server, which calls an external AI service to analyze sentiment. The app then stores the sentiment (e.g., “Positive” or “Negative”) alongside the entry for historical tracking.

3. Add/Manage Tags: Categorize entries with default or custom tags (with optional color codes).

4. Manage Existing Entries:
   • Edit or delete entries as needed. The system can re-run sentiment analysis when you update significant text, maintaining an evolving record of your emotional state.

5. Set Goals & Track Milestones: Create goals with statuses (in_progress, completed, on_hold, etc.) and note smaller achievements.

6. Explore Additional Insights (Optional):
   • If desired, you can incorporate charts or filters to group entries by sentiment, goals, or tags, offering deeper psychological or behavioral insights.

7. Enjoy Fluid UI: Observe smooth transitions and minimal design for a calming journaling experience.

8. Track Weather/Moon: Let the server or client fetch weather/moon data and store them in each entry for historical tracking.

## 6. API Documentation

Below is a comprehensive overview of each endpoint in the Insight: Reflective Journaling app.

![API Documentation](README-api-documentation.md)

## 7. Database Schema

![Database Schema](./assets/db-schema.png)
![dbdiagram.io](README-dbdiagram.md)

## 8. Deployment

1. **Frontend**
   • Deploy the React app to Netlify, Vercel, or Render’s static site hosting.
   • Set any environment variables if needed (e.g., REACT_APP_API_BASE_URL).
2. **Backend**
   • Deploy Flask + PostgreSQL on a service like Render, Heroku, or a VPS.
   • Make sure environment variables (DATABASE_URL, JWT_SECRET_KEY, etc.) are configured on the hosting platform.
3. **DNS & Domain (Optional)**
   • Point a custom domain to your frontend.
   • Ensure CORS is handled if your backend is on a different domain.

## 9. Contributing

1. **Fork the repository**.
2. **Create a Feature Branch**:
   git checkout -b feature/my-new-feature
3. **Commit your changes**:
   git commit -m 'Add new feature'
4. **Push to your branch**:
   git push origin feature/my-new-feature
5. **Open a pull request**:
   Describe your changes, request feedback, and once approved, merge into the main branch.

## 10. License

**None**
