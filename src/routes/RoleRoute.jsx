import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RoleRoute({ allow, children }) {
  const { user } = useAuth();

  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
