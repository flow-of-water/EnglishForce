import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// User pages 
import UserLayout from "./Layouts/UserLayout"
import HomePage from "./Pages/user/Home"; // Import HomePage
import LoginPage from './Pages/user/Login';
import RegisterPage from './Pages/user/Register';
import CoursesPage from './Pages/user/Course/Course';
import CourseDetail from './Pages/user/Course/CourseDetail';
import CourseUser from "./Pages/user/Course/CourseUser"
import CourseOverview from './Pages/user/Course/CourseOverview';
import ProfilePage from './Pages/user/Profile/Profile';
// User Payment 
import Cart from './Pages/user/Payment/Cart';
import CheckoutForm from './Pages/user/Payment/checkPage'
// OAuth
import OAuthLoginSuccess from './Pages/user/OAuth/OAuthLoginSuccess';

// Admin Pages
import AdminLayout from './Layouts/AdminLayout';
import ProtectedRoute from './Layouts/ProtectedRoute';
import AdminHome from './Pages/admin/HomeAdmin';
import CourseAdmin from './Pages/admin/Course/CourseAdmin'
import DetailCourseAdmin from './Pages/admin/Course/DetailCourseAdmin';
import CreateCourseAdmin from './Pages/admin/Course/CreateCourseAdmin';
import CourseSectionAdmin from './Pages/admin/Course/CourseSectionAdmin';
import EditSectionAdmin from './Pages/admin/Course/EditSectionAdmin';
import EditCourseAdmin from './Pages/admin/Course/EditCourseAdmin';
import CommentAdmin from './Pages/admin/Comment/CommentAdmin';

import UserAdmin from './Pages/admin/User/UserAdmin';

function App() {
  return (
    <Router>
      <Routes>
        {/* User */}
        <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
        <Route path="/login" element={<UserLayout><LoginPage /></UserLayout>} />
        <Route path="/register" element={<UserLayout><RegisterPage /></UserLayout>} />

        <Route path="/profile" element={<UserLayout><ProfilePage /></UserLayout>} />

        <Route path="/courses" element={<UserLayout><CoursesPage /></UserLayout>} />
        <Route path="/courses/overview/:id" element={<UserLayout><CourseOverview /></UserLayout>} />
        <Route path="/courses/:id" element={<UserLayout><CourseDetail /></UserLayout>} />

        <Route path="/courses-user" element={<UserLayout><CourseUser /></UserLayout>} />

        <Route path="/payment" element={<UserLayout><CheckoutForm /></UserLayout>} />
        <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
        <Route path="/login/success" element={<UserLayout><OAuthLoginSuccess /></UserLayout>} />

        {/* Admin  */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout><AdminHome /></AdminLayout>} />
          <Route path="/admin/courses" element={<AdminLayout><CourseAdmin /></AdminLayout>} />
          <Route path="/admin/courses/:id" element={<AdminLayout><DetailCourseAdmin /></AdminLayout>} />
          <Route path="/admin/courses/create" element={<AdminLayout><CreateCourseAdmin /></AdminLayout>} />
          <Route path="/admin/courses/sections/:id" element={<AdminLayout><CourseSectionAdmin /></AdminLayout>} />
          <Route path="/admin/courses/sections/:id/edit" element={<AdminLayout><EditSectionAdmin /></AdminLayout>} />
          <Route path="/admin/courses/edit/:id" element={<AdminLayout><EditCourseAdmin /></AdminLayout>} />

          <Route path="/admin/users" element={<AdminLayout><UserAdmin /></AdminLayout>} />
          <Route path="/admin/comments" element={<AdminLayout><CommentAdmin /></AdminLayout>} />
        </Route>
        {/* 404 */}
        <Route path="*" element={<UserLayout><img src="/404.jpeg" alt="404 Not Found" style={{ maxWidth: "100%", height: "auto" }} /> </UserLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
