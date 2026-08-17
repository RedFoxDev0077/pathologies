import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initAnalytics } from "./lib/analytics";

// Google Ads gtag is loaded via index.html — no duplicate injection here.
// initAnalytics configures the GA4 stream, replays a stored consent decision,
// and captures utm_*/gclid. Called before render so the campaign parameters are
// recorded even if the first route immediately redirects and strips the query.
initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
