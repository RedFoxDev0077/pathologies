import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Google Ads gtag is loaded via index.html — no duplicate injection here.

createRoot(document.getElementById("root")!).render(<App />);
