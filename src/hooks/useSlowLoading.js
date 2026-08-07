import { useState, useEffect } from "react";

// Returns true once `loading` has been true for longer than `delayMs`.
// Used to distinguish "normal brief loading" from "this is taking a while,
// the person deserves an explanation" - specifically for Render's free-tier
// cold start, where the first request after ~15 minutes of inactivity can
// take 20-60+ seconds to wake the server up.
export function useSlowLoading(loading, delayMs = 5000) {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsSlow(false);
      return;
    }
    const timer = setTimeout(() => setIsSlow(true), delayMs);
    return () => clearTimeout(timer);
  }, [loading, delayMs]);

  return isSlow;
}
