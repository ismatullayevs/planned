import React, { useState, useEffect, useRef } from "react";
import "./Form.scss";

export default function Form(props) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem("currentTodo") || "";
  });
  const inputRef = useRef(true);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem("currentTodo", value);
  }, [value]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    value !== "" && props.onSubmit(value);
    setValue("");
  };

  return (
    <form className="Form" onSubmit={onSubmit}>
      <button
        className={`Form__submit ${value ? "Form__submit--active" : ""}`}
        type="submit"
      >
        +
      </button>
      <input
        className="Form__input"
        type="text"
        placeholder="Add todo..."
        value={value}
        name="value"
        ref={inputRef}
        onChange={onChange}
      />
    </form>
  );
}
