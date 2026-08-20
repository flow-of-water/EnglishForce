import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimiter from './middleware/rateLimit.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config.js';
// OAuth
import passport from 'passport';

// ***** routes *****
import authRoutes from './routes/auth/auth.Route.js';
import authGoogleRoutes from './routes/auth/authGoogle.Route.js';
import authFacebookRoutes from './routes/auth/authFacebook.Route.js';
import authOtpcodeRoutes from './routes/auth/authOtp.Route.js';
import AIRoutes from './routes/AI.Route.js';
import userRoutes from './routes/user.Route.js';
// course
import courseRoutes from './routes/course/course.Route.js';
import courseSectionRoutes from './routes/course/courseSection.Route.js';
import paymentRoutes from './routes/course/payment.Route.js';
import userCourseRoutes from './routes/course/userCourse.Route.js';
import commentRoutes from './routes/course/comment.Route.js';
import interactionRoutes from './routes/course/interaction.Route.js';
// Stripe webhook
import stripeRoutes from './routes/course/stripe.Route.js';
// exam
import examRoutes from './routes/exam/exam.Route.js';
import examAttemptRoutes from './routes/exam/examAttempt.Route.js';
import questionRoutes from './routes/exam/question.Route.js';
import answerRoutes from './routes/exam/answer.Route.js';
import examPartRoutes from './routes/exam/examPart.Route.js';
// program
import programRoutes from './routes/program/program.Route.js';
import unitRoutes from './routes/program/unit.Route.js';
import lessonRoutes from './routes/program/lesson.Route.js';
import exerciseRoutes from './routes/program/exercise.Route.js';
import exerciseAnswerRoutes from './routes/program/exerciseAnswer.Route.js';
import userProcessRoutes from './routes/program/userProgress.Route.js';
// blog
import blogRoutes from './routes/blog/blog.Route.js';
import blogCategoryRoutes from './routes/blog/blogCategory.Route.js';
// feedback
import feedbackRoutes from './routes/feedback/feedback.Route.js';
import feedbackReplyRoutes from './routes/feedback/feedbackReply.Route.js';
// polymorphic
import polymorphicRoutes from './routes/_polymorphic/polymorphic.Routes.js';

const app = express();

app.use(
	cors({
		origin: process.env.FRONT_END_URL || 'http://localhost:3000',
		credentials: true, // ← Bắt buộc để gửi/nhận cookies
	})
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(passport.initialize());

app.get('/', (req, res) => {
	res.send('Welcome to The Last Water Bender API. Go to /api-docs for API documentation.');
});

app.get('/api', (req, res) => {
	res.send('Backend of The Last Water Bender is working.');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

// ***** WEBHOOK *****
// Payment Stripe webhook
app.use('/api/webhook', stripeRoutes);

// Không nên rate-limit webhook thanh toán, Từ đây trở xuống mới áp limiter cho API
app.use('/api', rateLimiter());

// ***** API *****
app.use('/api/auth', authRoutes);
app.use('/api/auth_google', authGoogleRoutes);
app.use('/api/auth_facebook', authFacebookRoutes);
app.use('/api/otp', authOtpcodeRoutes);
app.use('/api/users', userRoutes);

app.use('/api/AI', AIRoutes);

// Course
app.use('/api/courses', courseRoutes);
app.use('/api/course-sections', courseSectionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/user-course', userCourseRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/interactions', interactionRoutes);
// Exam
app.use('/api/exams', examRoutes);
app.use('/api/exam-parts', examPartRoutes);
app.use('/api/exam-attempts', examAttemptRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
// Program
app.use('/api/programs', programRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/exercise-answers', exerciseAnswerRoutes);
app.use('/api/user-progresses', userProcessRoutes);
// Blog
app.use('/api/blogs', blogRoutes);
app.use('/api/blog-categories', blogCategoryRoutes);
// Feedback
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/feedback-replies', feedbackReplyRoutes);
// Polymorphic
app.use('/api', polymorphicRoutes);

export default app;
