import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "./authApiSlice";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import TextInput from "../../components/TextInput";
import * as Yup from "yup";
import useAuth from "./useAuth";
import GoogleAuth from "../../components/GoogleAuth";

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
        console.log(err);
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
    <div className="signup__container">
      <div className="signup">
        <h3 className="form__title">Signup form</h3>
        {formMessage?.value ? (
          <p className={`form__message ${formMessage.type}`}>
            {formMessage.value}
          </p>
        ) : null}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={schema}
          onSubmit={(values, actions) => {
            onSubmit(values, actions);
          }}
        >
          <Form className="form">
            <TextInput label="Email" name="email" type="email" />
            <TextInput label="Password" name="password" type="password" />
            <TextInput
              label="Confirm Password"
              name="confirm_password"
              type="password"
            />
            <button type="submit" className="form__submit">
              Submit
            </button>
            <GoogleAuth />
          </Form>
        </Formik>
        <p className="form__footer">
          Not a member yet? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
