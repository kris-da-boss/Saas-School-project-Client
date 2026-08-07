import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <p className="text-sm text-charcoal/50">Loading...</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
