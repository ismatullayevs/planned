import { useSelector } from "react-redux";
import { selectCurrentUser } from "./authSlice";

const useAuth = () => {
  return useSelector(selectCurrentUser);
};

export default useAuth;
