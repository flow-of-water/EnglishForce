# Elearning - Full-Stack Online Learning Platform

🚀 **Elearning** is a modern, full-stack online learning platform built using **React, Node.js, Express, and PostgreSQL**. This project provides an intuitive and engaging environment for students and instructors, enabling seamless course management, interactive learning, and real-time assessments.

---

## **🛠️ Tech Stack**
- **Frontend:** React.js (with Material UI for UI components)
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Token)
- **State Management:** React Context 

---

## **🌟 Features**
✅ **User Authentication:** Secure login/register with JWT  
✅ **Role-based Access:** Separate roles for students & instructors  
✅ **Course Management:** Create, edit, delete, and enroll in courses   
✅ **Ratings & Reviews:** Users can rate and comment on courses    
✅ **Secure API:** Built with Express and PostgreSQL  

---

## **📦 Installation & Setup**

### **1️⃣ Clone the repository**
```bash
git clone https://github.com/yourusername/elearning.git
cd elearning
```

### **2️⃣ Install dependencies**
#### **Backend**
```bash
cd elearning-backend
npm install
```
#### **Frontend**
```bash
cd ../elearning-frontend
npm install
```

### **3️⃣ Setup environment variables**
Create `.env` files in both `elearning-frontend/` and `elearning-backend/` with the necessary configurations.

Example for **backend (`.env`)**:
```bash
DB_USER=postgres
DB_HOST=localhost
DB_NAME=elearning
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Example for **frontend (`.env`)**:
```bash
REACT_APP_STRIPE_TEST_KEY=your_stripe_test_key
```

### **4️⃣ Run the application**
#### **Backend**
```bash
cd elearning-backend
npm start
```
#### **Frontend**
```bash
cd ../elearning-frontend
npm start
```

🚀 The app should now be running at **`http://localhost:3000`**!

---

## **🔗 API Documentation**
The backend API provides RESTful endpoints for user authentication, course management, and interactions.  
For full API documentation, check the `README.md` inside `elearning-backend/` or visit the API docs (if hosted).


