import React from "react";
import ReactDOM from "react-dom/client";
import "./sass/main.scss";
import App from "./App";
import TodoApp from "./features/todos/TodoApp";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import Activate from "./features/auth/Activate";
import ResetPassword from "./features/settings/ResetPassword";
import ResetPasswordConfirm from "./features/settings/ResetPasswordConfirm";
import ChangePassword from "./features/auth/ChangePassword";

import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<TodoApp />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="activate/:uid/:token" element={<Activate />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route
            path="reest-password/:uid/:token"
            element={<ResetPasswordConfirm />}
          />
          <Route path="change-password/" element={<ChangePassword />} />
        </Route>
      </Routes>
    </Router>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
