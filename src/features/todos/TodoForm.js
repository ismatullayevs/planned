import React, { useState, useEffect, useRef } from "react";

export default function TodoForm(props) {
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
    <form className="todo__form" onSubmit={onSubmit} autoComplete="off">
      <div className="form__left">
        <div className="form__circle"></div>
        <input
          className="form__input"
          type="text"
          placeholder="Add todo..."
          value={value}
          name="value"
          ref={inputRef}
          onChange={onChange}
        />
      </div>
      <button className="form__submit" type="submit">
        Add
      </button>
    </form>
  );
}
