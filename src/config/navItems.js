import {
  LayoutGrid,
  GraduationCap,
  Presentation,
  Users,
  School,
  BookOpen,
  ClipboardList,
  FileCheck,
  Award,
  Megaphone,
} from "lucide-react";

export const adminNavItems = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/admin/students", label: "Students", icon: GraduationCap },
  { to: "/admin/teachers", label: "Teachers", icon: Presentation },
  { to: "/admin/parents", label: "Parents", icon: Users },
  { to: "/admin/classes", label: "Classes", icon: School },
  { to: "/admin/subjects", label: "Subjects", icon: BookOpen },
  { to: "/admin/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/admin/exams", label: "Exams", icon: FileCheck },
  { to: "/admin/report-cards", label: "Report Cards", icon: Award },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

export const teacherNavItems = [
  { to: "/teacher", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/teacher/classes", label: "My Classes", icon: School },
  { to: "/teacher/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/teacher/exams", label: "Exams", icon: FileCheck },
  { to: "/teacher/report-cards", label: "Report Cards", icon: Award },
  { to: "/teacher/announcements", label: "Announcements", icon: Megaphone },
];
