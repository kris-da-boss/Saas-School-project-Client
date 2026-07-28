import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ schoolCode: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form);
      navigate(`/${user.role}`);
    } catch (err) {
      if (err.response) {
        // Request reached the backend and got a real error back
        setError(`Server said: ${err.response.status} - ${err.response.data?.message || "Unknown error"}`);
      } else if (err.request) {
        // Request never got a response at all - CORS block, wrong URL, or backend down
        setError(
          `No response from server. Check: is VITE_API_URL set to "${import.meta.env.VITE_API_URL}"? Is that reachable?`
        );
      } else {
        setError(`Unexpected error: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-6">
      <Input
        label="School code"
        id="schoolCode"
        name="schoolCode"
        placeholder="Leave blank for platform login"
        value={form.schoolCode}
        onChange={handleChange}
      />
      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        required
        value={form.email}
        onChange={handleChange}
      />
      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        required
        value={form.password}
        onChange={handleChange}
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
