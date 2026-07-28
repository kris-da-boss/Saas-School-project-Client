import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/public/LoginPage";
import UnauthorizedPage from "../pages/public/UnauthorizedPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
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

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["admin"]}>
              <AdminDashboardPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
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
