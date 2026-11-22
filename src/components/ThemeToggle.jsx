"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const STORAGE_KEY = "rentrig-theme";

// Switches between the light and dark theme and remembers the choice in localStorage.
export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "rentrig");
  }, []);

  const toggle = () => {
    const next = theme === "rentrig-dark" ? "rentrig" : "rentrig-dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode can block storage; the theme still changes for this visit.
    }
    setTheme(next);
  };

  const isDark = theme === "rentrig-dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`btn btn-ghost btn-circle ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <FiSun className="size-5" /> : <FiMoon className="size-5" />}
    </button>
  );
}
