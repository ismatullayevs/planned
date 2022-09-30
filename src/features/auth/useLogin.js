import { useDispatch } from "react-redux";
import { setToken } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";

const useLogin = () => {
  const dispatch = useDispatch();
  const [login, status] = useLoginMutation();
  const trigger = async (data) => {
    const tokens = await login(data).unwrap();
    const { access, refresh } = tokens;
    localStorage.setItem("refresh", refresh);
    dispatch(setToken(access));
  };
  return [trigger, status];
};

export default useLogin;
