"use client";
import { useGlobals } from "@/providers/AppProvider";
import { BsSun, BsMoon } from "react-icons/bs";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useGlobals();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition ${
        isDark
          ? "hover:bg-gray-700 text-gray-200"
          : "hover:bg-gray-200 text-gray-700"
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? <BsSun size={20} /> : <BsMoon size={20} />}
    </button>
  );
}
