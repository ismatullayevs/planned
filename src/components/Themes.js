import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { BsMoonStars, BsSun } from "react-icons/bs";
import { MdOutlineDesktopWindows } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, selectTheme } from "../features/settings/settingsSlice";
import classNames from "classnames";

function Themes({ isOpen }) {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  const themes = {
    light: <BsSun />,
    dark: <BsMoonStars />,
    default: <MdOutlineDesktopWindows />,
  };

  const handleThemeChange = (theme) => {
    dispatch(setTheme(theme));
  };
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      in={isOpen}
      classNames="dropdown"
      timeout={100}
      unmountOnExit
      nodeRef={nodeRef}
    >
      <ul className="dropdown theme__list" ref={nodeRef}>
        {Object.keys(themes).map((theme, index) => (
          <li
            key={index}
            className={classNames("theme__item", {
              active: currentTheme === theme,
            })}
            onClick={() => handleThemeChange(theme)}
          >
            <span className="theme__icon">{themes[theme]}</span>
            <p className="theme__title">{theme}</p>
          </li>
        ))}
      </ul>
    </CSSTransition>
  );
}

export default Themes;
