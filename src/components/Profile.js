import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { logOut, setUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useUpdateUserMutation } from "../features/auth/authApiSlice";
import { CSSTransition } from "react-transition-group";
import { AiOutlineCamera } from "react-icons/ai";
import { toast } from "react-toastify";

function Profile({ user, isOpen }) {
  const dispatch = useDispatch();
  const [updateUser] = useUpdateUserMutation();
  const nodeRef = useRef(null);

  const handleLogout = () => {
    dispatch(logOut());
  };

  const onAvatarChange = async (e) => {
    const data = new FormData();
    data.append("avatar", e.target.files[0]);
    try {
      const response = await updateUser(data).unwrap();
      console.log(response);
      dispatch(setUser(response));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <CSSTransition
      in={isOpen}
      classNames="dropdown"
      timeout={100}
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div className="dropdown profile" ref={nodeRef}>
        <label className="profile__avatar">
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={onAvatarChange}
          />
          <span className="camera__icon">
            <AiOutlineCamera />
          </span>
          {user.avatar ? (
            <img src={user.avatar} alt="profile_img" className="profile__img" />
          ) : (
            <>{user.email.charAt(0).toUpperCase()}</>
          )}
        </label>
        <div className="profile__content">
          <h4 className="profile__email">{user.email}</h4>
          <Link to="/" className="profile__link">
            Change password
          </Link>
          <button className="profile__link" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </CSSTransition>
  );
}

export default Profile;
