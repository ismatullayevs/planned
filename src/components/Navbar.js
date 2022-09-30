import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { BsMoonStars, BsSun } from "react-icons/bs";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import { selectIsDark } from "../features/settings/settingsSlice";
import useOutsideCloser from "../hooks/useOutsideCloser";
import Profile from "./Profile";
import Themes from "./Themes";

function Navbar() {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user?.id;
  const isDark = useSelector(selectIsDark);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const themeRef = useRef(null);
  const profileRef = useRef(null);

  useOutsideCloser(themeRef, setIsThemeOpen);
  useOutsideCloser(profileRef, setIsProfileOpen);

  return (
    <div className="navbar__container noselect">
      <nav className="navbar">
        <Link className="navbar__brand" to="/">
          Todoist
        </Link>
        <ul className="navbar__items">
          <li
            className="navbar__item"
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            ref={themeRef}
          >
            <span className="navbar__icon">
              {isDark ? <BsMoonStars /> : <BsSun />}
            </span>
            <Themes isOpen={isThemeOpen} />
          </li>
          {isAuthenticated ? (
            <li className="navbar__item" ref={profileRef}>
              <div
                className="profile__toggler"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="profile__avatar">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="profile_img"
                      className="profile__img"
                    />
                  ) : (
                    <>{user.email.charAt(0).toUpperCase()}</>
                  )}
                </div>
              </div>
              <Profile user={user} isOpen={isProfileOpen} />
            </li>
          ) : (
            <li className="navbar__item">
              <Link to="/login" className="navbar__icon">
                <FiLogIn />
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
