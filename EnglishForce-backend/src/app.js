import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
// OAuth
import passport from 'passport';
// routes
import authRoutes from "./routes/auth/authRoutes.js";
import authGoogleRoutes from './routes/auth/authGoogleRoutes.js';
import authFacebookRoutes from './routes/auth/authFacebookRoutes.js';
import courseRoutes from "./routes/course/courseRoutes.js"
import courseSectionRoutes from "./routes/course/courseSectionRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import paymentRoutes from "./routes/course/paymentRoutes.js"
import userCourseRoutes from './routes/course/userCourseRoutes.js';
import chatBotRoutes from './routes/chatBotRoutes.js';
import commentRoutes from './routes/course/commentRoutes.js';
// Stripe webhook
import stripeRoutes from "./routes/course/stripeRoutes.js"
// exam
import examRoutes from "./routes/exam/examRoutes.js"
import examAttemptRoutes from "./routes/exam/examAttemptRoutes.js"
import questionRoutes from './routes/exam/questionRoutes.js'

const app = express()

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(passport.initialize());




app.get("/",(req,res)=> {
  res.send("Backend of The Last Water Bender is working. I'll teach you anything you want !") ;
})

// ***** WEBHOOK *****
// Payment Stripe webhook
app.use('/webhook',stripeRoutes);

// ***** API *****
app.use("/api/auth", authRoutes);
app.use('/api/auth_google',authGoogleRoutes); 
app.use('/api/auth_facebook',authFacebookRoutes) ;
app.use("/api/users",userRoutes);

app.use('/api/chatbot', chatBotRoutes) ;

// Course
app.use("/api/courses" , courseRoutes) ;
app.use("/api/course_sections" , courseSectionRoutes) ;
app.use('/api/payments', paymentRoutes);
app.use('/api/user-course', userCourseRoutes);
app.use('/api/comments', commentRoutes) ;
// Exam
app.use("/api/exams" , examRoutes) ;
app.use("/api/exam-attempts", examAttemptRoutes) ;
app.use('/api/questions', questionRoutes) ;

export default app ;
