import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
// routes
import authRoutes from "./src/routes/authRoutes.js";
import authGoogleRoutes from './src/routes/authGoogleRoutes.js';
import authFacebookRoutes from './src/routes/authFacebookRoutes.js';
import courseRoutes from "./src/routes/courseRoutes.js"
import courseSectionRoutes from "./src/routes/courseSectionRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"
import paymentRoutes from "./src/routes/paymentRoutes.js"
import userCourseRoutes from './src/routes/userCourseRoutes.js';
import chatBotRoutes from './src/routes/chatBotRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
// Stripe 
import stripeRoutes from "./src/routes/stripeRoutes.js"
// OAuth
import passport from 'passport';
// Sequelize 
import db from "./src/sequelize/models/index.js";
const { sequelize } = db;

const app = express()
const port = process.env.PORT ||5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(passport.initialize());




app.get("/",(req,res)=> {
  res.send("Backend of The Last Water Bender is working. I'll teach you anything you want !") ;
})

// WEBHOOK
app.use('/webhook',stripeRoutes);

// API
app.use("/api/auth", authRoutes);
app.use('/api/auth_google',authGoogleRoutes); 
app.use('/api/auth_facebook',authFacebookRoutes) ;
app.use("/api/courses" , courseRoutes) ;
app.use("/api/course_sections" , courseSectionRoutes) ;
app.use("/api/users",userRoutes)
app.use('/api/payments', paymentRoutes);
app.use('/api/user-course', userCourseRoutes);
app.use('/api/chatbot', chatBotRoutes) ;
app.use('/api/comments', commentRoutes) ;



// Kết nối Sequelize và khởi động server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    await sequelize.sync({ alter: true }); // hoặc { alter: true }
    console.log('📦 Models synchronized with DB');

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err);
  }
};
startServer();

