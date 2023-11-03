import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivateMutation } from "./authApiSlice";
import { toast } from "react-toastify";

function Activate() {
  const tokens = useParams();
  const navigate = useNavigate();
  const [activate] = useActivateMutation();

  useEffect(() => {
    async function activateUser() {
      try {
        activate(tokens).unwrap();
        toast.info(
          "You account has been activated. You can login to your account."
        );
        navigate("/login", { replace: true });
      } catch (err) {
        console.log(err);
        toast.error("There was an error activating your account.");
        navigate("/signup", { replace: true });
      }
    }
    activateUser();
  }, [activate, navigate, tokens]);

  return <div className="Activate"></div>;
}

export default Activate;
