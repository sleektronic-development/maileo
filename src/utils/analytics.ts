import { EmailAnalytics } from "@/types/email-interfaces";

const ANALYTICS_KEY = "maileo-analytics";

function getDefaultAnalytics(): EmailAnalytics {
  return {
    sent: 0,
    failed: 0,
    lastSentAt: undefined,
    lastFailedAt: undefined,
  };
}

export function getAnalytics(): EmailAnalytics {
  if (typeof window === "undefined") return getDefaultAnalytics();

  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : getDefaultAnalytics();
  } catch {
    return getDefaultAnalytics();
  }
}

export function updateAnalytics(type: "sent" | "failed"): EmailAnalytics {
  if (typeof window === "undefined") return getDefaultAnalytics();

  const current = getAnalytics();
  const now = new Date().toISOString();

  if (type === "sent") {
    current.sent += 1;
    current.lastSentAt = now;
  } else {
    current.failed += 1;
    current.lastFailedAt = now;
  }

  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(current));
  return current;
}

export function resetAnalytics(): EmailAnalytics {
  if (typeof window === "undefined") return getDefaultAnalytics();

  const defaults = getDefaultAnalytics();
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(defaults));
  return defaults;
}
