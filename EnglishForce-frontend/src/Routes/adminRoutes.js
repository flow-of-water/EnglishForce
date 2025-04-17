import { Route } from 'react-router-dom';
import AdminLayout from '../Layouts/AdminLayout';
import ProtectedRoute from '../Layouts/ProtectedRoute';

import AdminHome from '../Pages/admin/HomeAdmin';
import CourseAdmin from '../Pages/admin/Course/CourseAdmin';
import DetailCourseAdmin from '../Pages/admin/Course/DetailCourseAdmin';
import CreateCourseAdmin from '../Pages/admin/Course/CreateCourseAdmin';
import CourseSectionAdmin from '../Pages/admin/Course/CourseSectionAdmin';
import EditSectionAdmin from '../Pages/admin/Course/EditSectionAdmin';
import EditCourseAdmin from '../Pages/admin/Course/EditCourseAdmin';
import CommentAdmin from '../Pages/admin/Comment/CommentAdmin';
import UserAdmin from '../Pages/admin/User/UserAdmin';
// Exam feature
import ExamAdmin from "../Pages/admin/Exam/ExamAdmin" ;
import DetailExamAdmin from '../Pages/admin/Exam/DetailExamAdmin';
import CreateExamAdmin from '../Pages/admin/Exam/CreateExamAdmin';

export const AdminRoutes = () => (
  <Route element={<ProtectedRoute />}>
    <Route path="/admin" element={<AdminLayout><AdminHome /></AdminLayout>} />
    <Route path="/admin/users" element={<AdminLayout><UserAdmin /></AdminLayout>} />
    {/* Course feature */}
    <Route path="/admin/courses" element={<AdminLayout><CourseAdmin /></AdminLayout>} />
    <Route path="/admin/courses/create" element={<AdminLayout><CreateCourseAdmin /></AdminLayout>} />
    <Route path="/admin/courses/:publicId" element={<AdminLayout><DetailCourseAdmin /></AdminLayout>} />
    <Route path="/admin/courses/edit/:publicId" element={<AdminLayout><EditCourseAdmin /></AdminLayout>} />
    <Route path="/admin/courses/sections/:publicId" element={<AdminLayout><CourseSectionAdmin /></AdminLayout>} />
    <Route path="/admin/courses/sections/:publicId/edit" element={<AdminLayout><EditSectionAdmin /></AdminLayout>} />
    <Route path="/admin/comments" element={<AdminLayout><CommentAdmin /></AdminLayout>} />
    {/* Exam feature  */} 
    <Route path="/admin/exams" element={<AdminLayout><ExamAdmin /></AdminLayout>} />
    <Route path="/admin/exams/:publicId" element={<AdminLayout><DetailExamAdmin /></AdminLayout>} />
    <Route path="/admin/exams/create" element={<AdminLayout><CreateExamAdmin /></AdminLayout>} />
  </Route>
);
