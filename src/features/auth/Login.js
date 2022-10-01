import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import useAuth from "./useAuth";
import TextInput from "../../components/TextInput";
import { setTodos } from "../todos/todosSlice";
import useLogin from "./useLogin";
import GoogleAuth from "../../components/GoogleAuth";

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
    navigate("/");
  }
  const dispatch = useDispatch();

  const [login] = useLogin();
  const [formMessage, setFormMessage] = useState({});

  const onSubmit = async (data, { setSubmitting }) => {
    try {
      await login(data);
      dispatch(setTodos([]));
      setFormMessage({
        type: "success",
        value: "You are successfully logged in!",
      });
      navigate("/");
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
    <div className="login__container">
      <div className="login">
        <h3 className="form__title">Login form</h3>
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
            <Link to="/reset-password" className="password__reset">
              Forgot password?
            </Link>
            <button type="submit" className="form__submit">
              Submit
            </button>
            <GoogleAuth />
          </Form>
        </Formik>
        <p className="form__footer">
          Not a member yet? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
