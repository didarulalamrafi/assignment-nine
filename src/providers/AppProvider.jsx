"use client";

import React, { createContext, useContext } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

const AppContext = createContext(undefined);

function ContextStateBridge({ children }) {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";

    setTheme(nextTheme);

    document.cookie = `theme=${nextTheme}; path=/; max-age=31536000`;
  };

  return (
    <AppContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export default function AppProvider({ children, initialTheme }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={initialTheme || "system"}
      enableSystem
      disableTransitionOnChange
    >
      <ContextStateBridge>{children}</ContextStateBridge>
    </NextThemesProvider>
  );
}

export function useGlobals() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useGlobals must be used within an AppProvider");
  }
  return context;
}
