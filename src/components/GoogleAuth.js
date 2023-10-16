import React, { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useActivateWithGoogleMutation } from "../features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../features/auth/authSlice";
import { GrGooglePlus } from "react-icons/gr";
import { useLazyLoginWithGoogleQuery } from "../features/auth/authApiSlice";

function GoogleAuth() {
  const [searchParams] = useSearchParams();
  const [activateWithGoogle] = useActivateWithGoogleMutation();
  const state = searchParams.get("state");
  const code = searchParams.get("code");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authGoogle = useCallback(async () => {
    if (state && code) {
      try {
        const { access, refresh } = await activateWithGoogle({
          state,
          code,
        }).unwrap();
        console.log(state)
        console.log(refresh)
        localStorage.setItem("refresh", refresh);
        dispatch(setToken(access));
      } catch (err) {
        console.log(err);
      }
      navigate("/");
    }
  }, [activateWithGoogle, code, dispatch, navigate, state]);

  useEffect(() => {
    authGoogle();
  }, [authGoogle]);

  const [loginWithGoogle] = useLazyLoginWithGoogleQuery();

  const handleGoogleLogin = async () => {
    try {
      const data = await loginWithGoogle().unwrap();
      window.location.replace(data.authorization_url);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button
      type="button"
      className="form__submit google"
      onClick={handleGoogleLogin}
    >
      <GrGooglePlus />
      Continue with Google
    </button>
  );
}

export default GoogleAuth;
