"use client";

import { useState, useEffect } from "react";

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 12, 100));
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>

      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Loading...
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Preparing your experience
      </p>

      <div className="w-72 max-w-[80vw] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-200 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
