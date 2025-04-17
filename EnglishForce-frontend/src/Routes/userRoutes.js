import { Route } from 'react-router-dom';
import UserLayout from '../Layouts/UserLayout';

import OAuthLoginSuccess from '../Pages/user/OAuth/OAuthLoginSuccess'; // OAuth

import HomePage from '../Pages/user/Home';
import LoginPage from '../Pages/user/Login';
import RegisterPage from '../Pages/user/Register';
import ProfilePage from '../Pages/user/Profile/Profile';

// ***** Course feature *****
import CoursesPage from '../Pages/user/Course/Course';
import CourseOverview from '../Pages/user/Course/CourseOverview';
import CourseDetail from '../Pages/user/Course/CourseDetail';
import CourseUser from '../Pages/user/Course/CourseUser';
// User Payment
import Cart from '../Pages/user/Payment/Cart';
import CheckoutForm from '../Pages/user/Payment/checkPage';

// ***** Exam feature *****
import ExamPage from '../Pages/user/Exam/Exam';
import ExamDetailPage from '../Pages/user/Exam/ExamDetail';

export const UserRoutes = () => (
  <>
    <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
    <Route path="/login" element={<UserLayout><LoginPage /></UserLayout>} />
    <Route path="/register" element={<UserLayout><RegisterPage /></UserLayout>} />
    <Route path="/profile" element={<UserLayout><ProfilePage /></UserLayout>} />

    {/* course feature */}
    <Route path="/courses" element={<UserLayout><CoursesPage /></UserLayout>} />
    <Route path="/courses/overview/:publicId" element={<UserLayout><CourseOverview /></UserLayout>} />
    <Route path="/courses/:publicId" element={<UserLayout><CourseDetail /></UserLayout>} />
    <Route path="/courses-user" element={<UserLayout><CourseUser /></UserLayout>} />

    <Route path="/payment" element={<UserLayout><CheckoutForm /></UserLayout>} />
    <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />

    {/* exam feature  */}
    <Route path="/exams" element={<UserLayout><ExamPage /></UserLayout>} />
    <Route path="/exams/:publicId" element={<UserLayout><ExamDetailPage /></UserLayout>} />

    {/* OAuth  */}
    <Route path="/login/success" element={<UserLayout><OAuthLoginSuccess /></UserLayout>} />
  </>
);
