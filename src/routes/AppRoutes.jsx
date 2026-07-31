import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/public/LoginPage";
import UnauthorizedPage from "../pages/public/UnauthorizedPage";
import DashboardShell from "../components/layout/DashboardShell";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import ManageStudentsPage from "../pages/admin/ManageStudentsPage";
import ManageTeachersPage from "../pages/admin/ManageTeachersPage";
import ManageParentsPage from "../pages/admin/ManageParentsPage";
import ManageClassesPage from "../pages/admin/ManageClassesPage";
import ClassTimetablePage from "../pages/admin/ClassTimetablePage";
import ManageSubjectsPage from "../pages/admin/ManageSubjectsPage";
import TeacherDashboardPage from "../pages/teacher/TeacherDashboardPage";
import StudentDashboardPage from "../pages/student/StudentDashboardPage";
import ParentDashboardPage from "../pages/parent/ParentDashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Nested layout route: Sidebar renders ONCE and persists across
          /admin, /admin/students, /admin/teachers, /admin/parents — the
          <Outlet/> inside DashboardShell swaps only the page content. */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["admin"]}>
              <DashboardShell />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="students" element={<ManageStudentsPage />} />
        <Route path="teachers" element={<ManageTeachersPage />} />
        <Route path="parents" element={<ManageParentsPage />} />
        <Route path="classes" element={<ManageClassesPage />} />
        <Route path="classes/:classId/timetable" element={<ClassTimetablePage />} />
        <Route path="subjects" element={<ManageSubjectsPage />} />
      </Route>

      <Route
        path="/teacher"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["teacher"]}>
              <TeacherDashboardPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["student"]}>
              <StudentDashboardPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["parent"]}>
              <ParentDashboardPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
