import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/public/LoginPage";
import UnauthorizedPage from "../pages/public/UnauthorizedPage";
import DashboardShell from "../components/layout/DashboardShell";
import { adminNavItems, teacherNavItems, studentNavItems, parentNavItems } from "../config/navItems";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import ManageStudentsPage from "../pages/admin/ManageStudentsPage";
import ManageTeachersPage from "../pages/admin/ManageTeachersPage";
import ManageParentsPage from "../pages/admin/ManageParentsPage";
import ManageClassesPage from "../pages/admin/ManageClassesPage";
import ClassTimetablePage from "../pages/admin/ClassTimetablePage";
import ClassAttendancePage from "../pages/admin/ClassAttendancePage";
import ManageSubjectsPage from "../pages/admin/ManageSubjectsPage";
import ManageAssignmentsPage from "../pages/admin/ManageAssignmentsPage";
import AssignmentGradingPage from "../pages/admin/AssignmentGradingPage";
import ManageExamsPage from "../pages/admin/ManageExamsPage";
import ExamSittingDetailPage from "../pages/admin/ExamSittingDetailPage";
import ExamResultsPage from "../pages/admin/ExamResultsPage";
import ReportCardsPage from "../pages/admin/ReportCardsPage";
import ManageAnnouncementsPage from "../pages/admin/ManageAnnouncementsPage";
import TeacherDashboardPage from "../pages/teacher/TeacherDashboardPage";
import TeacherClassesPage from "../pages/teacher/TeacherClassesPage";
import StudentDashboardPage from "../pages/student/StudentDashboardPage";
import StudentAssignmentsPage from "../pages/student/StudentAssignmentsPage";
import StudentReportCardPage from "../pages/student/StudentReportCardPage";
import StudentTimetablePage from "../pages/student/StudentTimetablePage";
import ParentDashboardPage from "../pages/parent/ParentDashboardPage";
import ParentReportCardPage from "../pages/parent/ParentReportCardPage";
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
              <DashboardShell navItems={adminNavItems} roleLabel="Admin" />
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
        <Route path="classes/:classId/attendance" element={<ClassAttendancePage />} />
        <Route path="subjects" element={<ManageSubjectsPage />} />
        <Route path="assignments" element={<ManageAssignmentsPage />} />
        <Route path="assignments/:id/grade" element={<AssignmentGradingPage />} />
        <Route path="exams" element={<ManageExamsPage />} />
        <Route path="exams/sitting" element={<ExamSittingDetailPage />} />
        <Route path="exams/:examId/results" element={<ExamResultsPage />} />
        <Route path="report-cards" element={<ReportCardsPage />} />
        <Route path="announcements" element={<ManageAnnouncementsPage />} />
      </Route>

      {/* Teacher shell - same pattern, own nav, reuses the Attendance and
          Assignment page components (they're role-aware internally rather
          than duplicated per role). Timetable stays admin-only - not
          something teachers were asked to manage. */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["teacher"]}>
              <DashboardShell navItems={teacherNavItems} roleLabel="Teacher" />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboardPage />} />
        <Route path="classes" element={<TeacherClassesPage />} />
        <Route path="classes/:classId/attendance" element={<ClassAttendancePage />} />
        <Route path="assignments" element={<ManageAssignmentsPage />} />
        <Route path="assignments/:id/grade" element={<AssignmentGradingPage />} />
        <Route path="exams" element={<ManageExamsPage />} />
        <Route path="exams/sitting" element={<ExamSittingDetailPage />} />
        <Route path="exams/:examId/results" element={<ExamResultsPage />} />
        <Route path="report-cards" element={<ReportCardsPage />} />
        <Route path="announcements" element={<ManageAnnouncementsPage />} />
      </Route>

      {/* Student shell - Overview is now a lean summary; My Assignments,
          Report Card, and Timetable each get their own page, reached via
          the sidebar or the Overview's quick-shortcut links. */}
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["student"]}>
              <DashboardShell navItems={studentNavItems} roleLabel="Student" />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboardPage />} />
        <Route path="assignments" element={<StudentAssignmentsPage />} />
        <Route path="report-card" element={<StudentReportCardPage />} />
        <Route path="timetable" element={<StudentTimetablePage />} />
      </Route>

      {/* Parent shell - same pattern; the Overview's own child-selector is
          for summary stats, the Report Cards page has its own (reusing
          MyChildrenReportCards, which already handles multiple children). */}
      <Route
        path="/parent"
        element={
          <ProtectedRoute>
            <RoleRoute allow={["parent"]}>
              <DashboardShell navItems={parentNavItems} roleLabel="Parent" />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<ParentDashboardPage />} />
        <Route path="report-card" element={<ParentReportCardPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
