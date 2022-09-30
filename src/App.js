import React from "react";
import { Outlet } from "react-router-dom";
import { useLazyLoadUserQuery } from "./features/auth/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectCurrentToken } from "./features/auth/authSlice";
import { useEffect, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import useTheme from "./features/settings/useTheme";

import "react-toastify/dist/ReactToastify.css";
import classNames from "classnames";
import Navbar from "./components/Navbar";
import { selectIsDark } from "./features/settings/settingsSlice";

function App() {
  const dispatch = useDispatch();
  const accessToken = useSelector(selectCurrentToken);
  const [trigger] = useLazyLoadUserQuery();
  useTheme();
  const isDark = useSelector(selectIsDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const getUser = useCallback(async () => {
    try {
      const data = await trigger().unwrap();
      dispatch(setUser(data));
    } catch (err) {
      if (err?.status !== 403) {
        console.log(err);
      }
    }
  }, [dispatch, trigger]);

  useEffect(() => {
    getUser();
  }, [getUser, accessToken]);

  return (
    // TODO: Add accessibility
    <div className={classNames("App", "clearfix")}>
      <Navbar />
      <ToastContainer hideProgressBar />
      <Outlet />
    </div>
  );
}

export default App;
