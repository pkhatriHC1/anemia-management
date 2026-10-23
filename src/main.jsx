import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Reset demo state on every load so the app always reflects the original
// published source of truth — no user interactions persist across refreshes.
const DEMO_KEYS = [
  "clinicaliq-epic-pools-v1",
  "clinicaliq-case-completions-v1",
  "clinicaliq-audit-trail-v1",
  "clinicaliq-follow-ups-v3",
  "clinicaliq-follow-up-decisions",
  "clinicaliq-care-coordination",
];
DEMO_KEYS.forEach((key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
