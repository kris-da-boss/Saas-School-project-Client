import LoginForm from "../../features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 border-b border-rule pb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Registrar's Office</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Sign in</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
