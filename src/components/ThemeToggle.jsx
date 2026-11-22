"use client";

import { useSyncExternalStore } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const STORAGE_KEY = "rentrig-theme";

// The current theme lives on <html data-theme="...">; these let React follow it.
function subscribe(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const getTheme = () => document.documentElement.getAttribute("data-theme") || "rentrig";
const getServerTheme = () => "rentrig";

// Switches between the light and dark theme and remembers the choice in localStorage.
export default function ThemeToggle({ className = "" }) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const isDark = theme === "rentrig-dark";

  const toggle = () => {
    const next = isDark ? "rentrig" : "rentrig-dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode can block storage; the theme still changes for this visit.
    }
  };

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
