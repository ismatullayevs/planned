import React from "react";
import classNames from "classnames";
import { BsTrash } from "react-icons/bs";
import { BsCheck } from "react-icons/bs";

export default function TodoItem(props) {
  const todo = props.todo;

  const onBlur = (e) => {
    const id = todo.id;
    if (e.target.value === "" && e.target.type === "text") {
      props.onDelete(id);
    }
  };

  return (
    <div className={classNames("item", { completed: todo.completed })}>
      <div className="item__left">
        <label htmlFor={`todo-${todo.id}`} className="item__completed">
          <input
            id={`todo-${todo.id}`}
            className="item__checkbox"
            type="checkbox"
            name="completed"
            checked={todo.completed}
            onChange={(e) => props.onChange(e, todo.id)}
            tabIndex={-1}
          />
          <BsCheck className="checked__icon" />
        </label>
        <input
          className="item__input"
          type="text"
          name="task"
          value={todo.task}
          onChange={(e) => {
            props.onChange(e, todo.id);
          }}
          onBlur={onBlur}
        />
      </div>
      <BsTrash
        className="delete__icon"
        onClick={() => props.onDelete(todo.id)}
      />
    </div>
  );
}
