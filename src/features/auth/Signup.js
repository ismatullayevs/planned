import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "./authApiSlice";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import useAuth from "./useAuth";
import "./Signup.scss";

const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("This field is required"),
  password: Yup.string()
    .min(6, "Your password must have at least 6 characters")
    .required("This field is required"),
  confirm_password: Yup.string()
    .min(6, "Your password must have at least 6 characters")
    .required("This field is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

function Signup() {
  const navigate = useNavigate();
  const user = useAuth();
  if (user?.id) {
    navigate(-1);
  }
  const [register] = useRegisterMutation();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [formMessage, setFormMessage] = useState({
    type: "",
    value: "",
  });

  const onSubmit = async (data, actions) => {
    setFormMessage({ type: "", value: "" });
    try {
      await register(data).unwrap();
      setFormMessage({
        type: "success",
        value: `An activation link has been sent to ${data.email}.`,
      });
      setIsEmailSent(true);
    } catch (err) {
      if (err.status === 403 && err?.data?.detail) {
        setFormMessage({ type: "error", value: err.data.detail });
      } else if (err.status === 400 && err?.data) {
        const values = Object.values(err.data);
        setFormMessage({ type: "error", value: values[0] });
      } else {
        setFormMessage({
          type: "error",
          value: "Something went wrong. Please try again later.",
        });
      }
    }
    actions.setSubmitting(false);
  };

  if (isEmailSent) {
    return (
      <div className="Signup">
        <h3 className="form__header">Sign Up Form</h3>
        {formMessage.value && (
          <p className={`form__message ${formMessage.type}`}>
            {formMessage.value}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="Signup">
      <h3 className="form__header">Sign Up Form</h3>
      <p className="form__title">Please fill out the sign up form</p>
      {formMessage.value && (
        <p className={`form__message ${formMessage.type}`}>
          {formMessage.value}
        </p>
      )}
      <Formik
        initialValues={{ email: "", password: "", confirm_password: "" }}
        validationSchema={schema}
        onSubmit={(values, actions) => {
          onSubmit(values, actions);
        }}
      >
        {({ isSubmitting, handleChange, handleBlur, values, status }) => (
          <Form className="form" noValidate autoComplete="off">
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
            <div className="form__group">
              <label htmlFor="confirm_password" className="form__label">
                Confirm Password
              </label>
              <br />
              <Field name="confirm_password">
                {({ field, meta: { touched, error } }) => (
                  <input
                    placeholder="Confirm password"
                    type="password"
                    className={classNames("form__input", {
                      invalid: touched && error,
                    })}
                    {...field}
                  />
                )}
              </Field>
              <ErrorMessage
                name="confirm_password"
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
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
