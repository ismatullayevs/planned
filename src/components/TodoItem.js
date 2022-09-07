import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./TodoItem.scss";

export default function TodoItem(props) {
  const todo = props.todo;

  const onBlur = (e, id) => {
    if (e.target.value === "" && e.target.type === "text") {
      props.onDelete(id);
    }
  };

  return (
    <div className="item">
      <div className="item__left">
        <div
          className={`item__checkbox ${
            todo.completed ? "item__checkbox--completed" : ""
          }`}
        >
          <input
            type="checkbox"
            className="check"
            name="completed"
            checked={todo.completed}
            onChange={(e) => props.onChange(e, todo.id)}
          />
          <span className="check-mask">
            <FontAwesomeIcon icon="fa-solid fa-check" />
          </span>
        </div>
        <input
          className={`item__input ${
            todo.completed ? "item__input--completed" : ""
          }`}
          type="text"
          value={todo.text}
          name="text"
          onChange={(e) => props.onChange(e, todo.id)}
          onBlur={(e) => onBlur(e, todo.id)}
        />
      </div>
      <div className="item__right">
        <button
          className="item__delete"
          onClick={() => props.onDelete(todo.id)}
        >
          <FontAwesomeIcon icon="fa fa-remove" />
        </button>
      </div>
    </div>
  );
}
