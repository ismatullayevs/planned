import React from "react";
import { Routes, Route } from "react-router-dom";
import TodoApp from "./features/todos/TodoApp";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import Activate from "./features/auth/Activate";
import ResetPassword from "./features/settings/ResetPassword";
import ResetPasswordConfirm from "./features/settings/ResetPasswordConfirm";
import "./App.scss";
import { useLazyLoadUserQuery } from "./features/auth/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectCurrentToken } from "./features/auth/authSlice";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import useTheme from "./features/settings/useTheme";

import "react-toastify/dist/ReactToastify.css";
import classNames from "classnames";

function App() {
  const dispatch = useDispatch();
  const accessToken = useSelector(selectCurrentToken);
  const [trigger] = useLazyLoadUserQuery();
  const isDark = useTheme();

  useEffect(() => {
    async function getUsers() {
      try {
        const data = await trigger().unwrap();
        dispatch(setUser(data));
      } catch (err) {}
    }
    getUsers();
  }, [accessToken, dispatch, trigger]);

  return (
    <div className={classNames("App", "clearfix", { dark: isDark })}>
      <ToastContainer hideProgressBar />
      <Routes>
        <Route path="/" element={<TodoApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/activate/:uid/:token" element={<Activate />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/reset-password-confirm/:uid/:token"
          element={<ResetPasswordConfirm />}
        />
      </Routes>
    </div>
  );
}

export default App;
