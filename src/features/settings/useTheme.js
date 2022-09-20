import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "./settingsSlice";

const useTheme = () => {
  const isSystemDark = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = useSelector(selectTheme);
  const [isDarkTheme, setIsDarkTheme] = useState(
    theme === "light" ? false : theme === "dark" ? true : isSystemDark()
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);

    setIsDarkTheme(
      theme === "light" ? false : theme === "dark" ? true : isSystemDark()
    );
    const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const evtListener = (e) => {
      if (theme === "default") {
        setIsDarkTheme(e.matches);
      }
    };
    darkTheme.addEventListener("change", evtListener);

    return () => darkTheme.removeEventListener("change", evtListener);
  }, [theme]);

  return isDarkTheme;
};

export default useTheme;
