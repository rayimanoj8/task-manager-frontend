import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({
    theme: "system",
    setTheme: () => {},
});

function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme" }) {
    const [theme, setThemeState] = useState(
        () => localStorage.getItem(storageKey) || defaultTheme
    );

    useEffect(() => {
        const root = document.querySelector("html");

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }

        localStorage.setItem(storageKey, theme);
    }, [theme]);

    const setTheme = (newTheme) => {
        setThemeState(newTheme);  // ✅ Use the correct state setter function
    };

    return (
        <ThemeProviderContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};

export { ThemeProvider, useTheme };
