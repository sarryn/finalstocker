import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set default language to ensure proper currency formatting
document.documentElement.lang = 'en-IN';

createRoot(document.getElementById("root")!).render(<App />);
