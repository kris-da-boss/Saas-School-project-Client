import { Component } from "react";

// Without this, an uncaught error anywhere in the component tree unmounts
// the ENTIRE app and React shows nothing at all - a blank screen with no
// indication anything went wrong, which is exactly the symptom of "blank
// background after login". This catches that and shows the actual error
// instead, so a real bug becomes diagnosable instead of invisible.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Still goes to the console for anyone who does have devtools open
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-parchment px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Something went wrong</p>
          <h1 className="font-display text-xl text-ink">This page hit an error</h1>
          <p className="max-w-md text-sm text-charcoal/60">
            Please screenshot the message below and share it — it tells us exactly what broke.
          </p>
          <pre className="mt-2 max-w-full overflow-x-auto whitespace-pre-wrap rounded-sm border border-rule bg-white/50 p-3 text-left text-xs text-red-700">
            {this.state.error.message}
          </pre>
          <button
            onClick={() => window.location.assign("/login")}
            className="mt-2 rounded-sm border border-ink px-4 py-2 text-sm text-ink hover:bg-ink hover:text-parchment"
          >
            Back to login
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
