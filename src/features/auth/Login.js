import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import useAuth from "./useAuth";
import "./Login.scss";

const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("This field is required"),
  password: Yup.string()
    .min(6, "Your password must have at least 6 characters")
    .required("This field is required"),
});

function Login() {
  const navigate = useNavigate();
  const user = useAuth();
  if (user?.id) {
    navigate(-1);
  }
  const dispatch = useDispatch();

  const [login] = useLoginMutation();
  const [formMessage, setFormMessage] = useState({
    type: "",
    value: "",
  });

  const onSubmit = async (data, { setSubmitting }) => {
    try {
      const tokens = await login(data).unwrap();
      const { access, refresh } = tokens;
      localStorage.setItem("refresh", refresh);
      dispatch(setToken(access));
      setFormMessage({
        type: "success",
        value: "You are successfully logged in!",
      });
      navigate(-1);
    } catch (err) {
      if (err.status === 401 && err.data?.detail) {
        setFormMessage({ type: "error", value: err.data.detail });
      } else {
        setFormMessage({
          type: "error",
          value: "Something went wrong. Please try again later.",
        });
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="Login">
      <h3 className="form__header">Login Form</h3>
      <p className="form__title">Please fill out the login form</p>
      {formMessage.value && (
        <p className={`form__message ${formMessage.type}`}>
          {formMessage.value}
        </p>
      )}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={schema}
        onSubmit={(values, actions) => {
          onSubmit(values, actions);
        }}
      >
        {({ isSubmitting, handleChange, handleBlur, values, status }) => (
          <Form className="form" noValidate>
            {status}
            <div className="form__group">
              <label htmlFor="email" className="form__label">
                Email
              </label>
              <br />
              <Field name="email">
                {({ field, meta: { touched, error } }) => (
                  <input
                    type="email"
                    placeholder="Your email address"
                    className={classNames("form__input", {
                      invalid: touched && error,
                    })}
                    {...field}
                  />
                )}
              </Field>
              <ErrorMessage
                name="email"
                component="p"
                className="form__error"
              />
            </div>
            <div className="form__group">
              <label htmlFor="password" className="form__label">
                Password
              </label>
              <br />
              <Field name="password">
                {({ field, meta: { touched, error } }) => (
                  <input
                    type="password"
                    placeholder="Your password"
                    className={classNames("form__input", {
                      invalid: touched && error,
                    })}
                    {...field}
                  />
                )}
              </Field>
              <ErrorMessage
                name="password"
                component="p"
                className="form__error"
              />
            </div>
            <button
              className="form__submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
      <p className="form__link">
        Not member yet? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;
