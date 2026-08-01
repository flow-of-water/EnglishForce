# English Force

**This project is my Graduation Project in University (Final Year Project) focused on developing an online English learning platform.**

English Force is an online English learning platform that helps users study effectively through diverse courses, lessons, exercises, and exams. The project consists of three main parts: a React frontend and a Node.js backend with PostgreSQL database and a FastAI backend that run my AI models.

---

## Introduction

English Force provides a comprehensive English course management system, including:

- Management of courses, learning programs, units, lessons, and exercises.
- Exams with multiple parts, questions, and answers.
- User system with role-based access control.
- Media upload and storage for videos, images, and audio recordings via Cloudinary.
- Tracking users’ learning progress.
- AI backend built with FastAPI that powers a retrieval-based chatbot and a hybrid recommendation system to enhance personalized learning experiences.

---

## Key Features

- **Authentication:** Email/password login, Google & Facebook OAuth, OTP email verification, JWT access + refresh tokens, password reset.
- **Courses:** Full CRUD for courses, sections, programs, units, and lessons; keyword search; top-rated listing; bulk cart enrollment; star ratings and reviews; per-course user notes.
- **Exams:** Multi-part exams (Exam → Parts → Questions → Answers) with image/audio uploads; automatic score calculation; per-user attempt history.
- **Progress tracking:** Lesson-level completion records with score and timestamp; program-wide completion overview.
- **Reactions:** Like, love, helpful, and insightful reactions on courses, comments, and blogs.
- **Blog:** Blog posts with categories, thumbnail uploads, slug-based lookup, and pagination.
- **Feedback:** Users submit feedback with images; threaded replies for support responses.
- **Payments:** Stripe payment intents for course purchases, webhook confirmation, admin revenue dashboard.
- **AI chatbot:** Intent-matching neural network (TensorFlow/Keras) for learner Q&A.
- **Recommendation system:** Hybrid collaborative + content-based filtering (scikit-learn) for personalized course suggestions; admin can trigger model retraining.
- **AI writing check:** Grammar and style feedback on user-submitted text.
- **Media management:** Cloudinary for course thumbnails, video lessons, user avatars, and exam audio/images.
- **Internationalization:** English and Vietnamese UI via i18next; language auto-detected from browser and saved to localStorage.
- **Role-based access:** Users can enroll, comment, and take exams; admins manage all content, users, and ML models.

---

## Technologies Used

- Frontend: React.js, Material-UI (MUI)
- Backend: Node.js, Express.js, Sequelize ORM
- Database: PostgreSQL
- Caching: Redis
- Media Storage: Cloudinary
- Authentication: JSON Web Token (JWT)
- Containerization/DevOps: Docker & Docker Compose

---

## System Architecture

- Frontend: React single-page application (SPA) communicating via REST API.
- Main Backend: REST API using Express with Sequelize ORM to connect to PostgreSQL.
- Models include User, Course, CourseSection, Comment, Program, Unit, Lesson, Exercise, ExerciseAnswer, Exam, ExamPart, Question, Answer, ExamAttempt, UserCourse, UserProgress.
- Media uploads handled with Cloudinary for videos, images, and audio.
- Authentication and authorization based on JWT tokens and user roles (admin, user).
- A FastAPI service running machine learning models for a retrieval-based chatbot and a hybrid recommendation system, which provide intelligent interactions and personalized course suggestions.




## Screenshots

Below are some screenshots of **English Force**:

### Home Page

| ![Home Page](EnglishForce-general/EnglishForce-Docs/Demo/main1.png) | ![Home Page 2](EnglishForce-general/EnglishForce-Docs/Demo/main2.png) |
|---|---|

### Test Pages
| ![Test Page](EnglishForce-general/EnglishForce-Docs/Demo/test1.png) | ![Test Page](EnglishForce-general/EnglishForce-Docs/Demo/test2.png) |
|---|---|

### Course Pages
| ![Test Page](EnglishForce-general/EnglishForce-Docs/Demo/course1.png) | ![Payment](EnglishForce-general/EnglishForce-Docs/Demo/course2.png) |
|---|---|

### Chatbot
![Chatbot](EnglishForce-general/EnglishForce-Docs/Demo/chatbot1.png)


---


## How to Run

> **Note:**  **create `.env` file from `env_example.txt`** for each service (FE, BE, AI)

### 1. Run with Docker

- Install Docker and Docker Compose
- From the project root directory, run:
```
docker-compose up -d
```

### 2. Run without Docker

#### Backend (Node.js + PostgreSQL)

1. Clone repository and install dependencies:
   ```bash
   git clone https://github.com/flow-of-water/english-force.git
   cd EnglishForce/EnglishForce-backend
   npm install
    ```
2. Set up PostgreSQL:

   Create a database named englishforce 

3. Run migrations & seeds

   If you need sample data, run the seeds.
   - Apply all seeds (in EnglishForce-backend folder):
   ```
     npx sequelize-cli db:seed:all
   ```
   - Undo all seeds:
   ```
   npx sequelize-cli db:seed:undo:all
   ```

   Login account (after seeding): username: `admin` / password: `Admin@123`


4. Start the backend:
   ```
   nodemon server.js
   ```
   Or 
   ```
   node server.js
   ```

#### Frontend (React)

1. Open another terminal:
   ```
   cd EnglishForce/EnglishForce-frontend
   npm install
   ```
2. Start the frontend:
   ```
   npm start
   ```
3. If run on production, npm run build and set up nginx

#### AI Service (FastAPI)  [Optional]

1. Open another terminal:
   ```
   cd EnglishForce/EnglishForce-AI/AIServer
   pip install -r requirements.txt
   ```
2. Run the server:
   ```
   python server.py
   ```
#### Database Seeding
1. Seed all
   ```
   npx sequelize-cli db:seed:all
   ```

2. Undo all seeds
   ```
   npx sequelize-cli db:seed:undo:all
   ```

---

## Folder Structure

```
EnglishForce/
├── docker-compose.yml
├── docker-compose.prod.yml
├── README.md
│
├── EnglishForce-backend/
│   ├── server.js
│   ├── Dockerfile
│   └── src/
│       ├── app.js
│       ├── config/               # Cloudinary, Redis, Swagger setup
│       ├── constants/            # Shared enums and API messages
│       ├── controllers/          # Request/response handlers (by domain)
│       │   ├── auth/
│       │   ├── blog/
│       │   ├── course/
│       │   ├── exam/
│       │   ├── feedback/
│       │   ├── program/
│       │   ├── AI.Controller.js
│       │   └── user.Controller.js
│       ├── docs/                 # Swagger documentation per domain
│       ├── middleware/           # JWT auth, rate limiting
│       ├── routes/               # API route definitions (by domain)
│       ├── sequelize/
│       │   ├── config/
│       │   ├── migrations/
│       │   ├── models/
│       │   └── seeders/
│       ├── services/             # Business logic (by domain)
│       │   ├── blog/
│       │   ├── course/
│       │   ├── exam/
│       │   ├── feedback/
│       │   ├── otp/
│       │   ├── program/
│       │   ├── interaction.service.js
│       │   └── user.service.js
│       └── utils/                # JWT, hashing, Redis cache, mailer
│
├── EnglishForce-frontend/
│   ├── public/
│   ├── Dockerfile
│   └── src/
│       ├── App.js
│       ├── Api/                  # Axios instance & interceptors
│       ├── Components/           # Reusable UI components
│       │   ├── admin/
│       │   └── user/
│       ├── Constants/            # API endpoint strings, localStorage keys
│       ├── Context/              # CartContext, SearchContext
│       ├── i18n/                 # i18next config & locale files
│       ├── Layouts/              # AdminLayout, UserLayout, ProtectedRoute
│       ├── Pages/                # Page-level components
│       │   ├── admin/
│       │   └── user/
│       └── Routes/               # adminRoutes.js, userRoutes.js
│
├── EnglishForce-AI/
│   ├── AIServer/                 # Production FastAPI service
│   │   ├── server.py
│   │   ├── config.py
│   │   ├── db_utils.py
│   │   ├── Dockerfile
│   │   ├── chatbot/              # Neural network chatbot (TensorFlow/Keras)
│   │   └── recommended_system/   # Hybrid recommendation engine
│   └── Retrieval based Chatbots/ # Chatbot training & experimentation
│
└── EnglishForce-general/
    ├── DB-Design/                # Database schema (dbdiagram.io)
    ├── EnglishForce-Docs/        # Diagrams, demo screenshots, issue logs
    └── load_test.py
```