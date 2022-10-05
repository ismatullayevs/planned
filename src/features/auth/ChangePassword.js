import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import useAuth from "./useAuth";
import TextInput from "../../components/TextInput";
import { useChangePasswordMutation } from "./authApiSlice";
import { toast } from "react-toastify";

const schema = Yup.object({
  current_password: Yup.string()
    .min(6, "Your password must have at least 6 characters")
    .required("This field is required"),
  new_password: Yup.string()
    .min(6, "Your password must have at least 6 characters")
    .required("This field is required"),
  confirm_new_password: Yup.string()
    .min(6, "Your password must have at least 6 characters")
    .required("This field is required")
    .oneOf([Yup.ref("new_password"), null], "Passwords must match"),
});

function ChangePassword() {
  const navigate = useNavigate();
  const user = useAuth();
  if (!user?.id) {
    navigate("/");
  }
  //   TODO: Protected route

  const [changePassword] = useChangePasswordMutation();
  const [formMessage, setFormMessage] = useState({});

  const onSubmit = async (data, { setSubmitting }) => {
    try {
      await changePassword(data).unwrap();
      toast.info("Your password was successfully updated");
      navigate("/");
    } catch (err) {
      setFormMessage({ type: "error", value: "Something went wrong" });
    }
    setSubmitting(false);
  };

  return (
    <div className="change-password__container">
      <div className="change-password">
        <h3 className="form__title">Change Password</h3>
        {formMessage?.value ? (
          <p className={`form__message ${formMessage.type}`}>
            {formMessage.value}
          </p>
        ) : null}
        <Formik
          initialValues={{
            current_password: "",
            new_password: "",
            confirm_new_password: "",
          }}
          validationSchema={schema}
          onSubmit={(values, actions) => {
            onSubmit(values, actions);
          }}
        >
          <Form className="form">
            <TextInput
              label="Curent Password"
              name="current_password"
              type="password"
            />
            <TextInput
              label="New Password"
              name="new_password"
              type="password"
            />
            <TextInput
              label="Confirm New Password"
              name="confirm_new_password"
              type="password"
            />
            <Link to="/reset-password" className="password__reset">
              Forgot password?
            </Link>
            <button type="submit" className="form__submit">
              Change Password
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ChangePassword;
