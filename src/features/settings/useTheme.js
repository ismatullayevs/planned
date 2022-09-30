import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme, setIsDark } from "./settingsSlice";

const useTheme = () => {
  const dispatch = useDispatch();
  const isSystemDark = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = useSelector(selectTheme);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    dispatch(
      setIsDark(
        theme === "light" ? false : theme === "dark" ? true : isSystemDark()
      )
    );
    const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const evtListener = (e) => {
      if (theme === "default") {
        dispatch(setIsDark(e.matches));
      }
    };
    darkTheme.addEventListener("change", evtListener);

    return () => darkTheme.removeEventListener("change", evtListener);
  }, [theme, dispatch]);
};

export default useTheme;
