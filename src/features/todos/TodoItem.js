import React from "react";
import classNames from "classnames";
import { BsTrash, BsCheck } from "react-icons/bs";
import { HiSwitchVertical } from "react-icons/hi";
import { Draggable } from "react-beautiful-dnd";

export default function TodoItem(props) {
  const todo = props.todo;

  const onBlur = (e) => {
    const id = todo.id;
    if (e.target.value === "" && e.target.type === "text") {
      props.onDelete(id);
    }
  };

  function getStyle(style) {
    if (style?.transform) {
      const axisLockY = `translate(0px, ${style.transform.split(",").pop()}`;
      return {
        ...style,
        transform: axisLockY,
      };
    }
    return style;
  }

  return (
    <Draggable draggableId={String(todo.id)} index={props.index}>
      {(provided, snapshot) => {
        const containerProps = props.isTouchDevice && provided.dragHandleProps;
        return (
          <div
            className={classNames("item", { completed: todo.completed })}
            {...provided.draggableProps}
            ref={provided.innerRef}
            style={getStyle(provided.draggableProps.style, snapshot)}
            {...containerProps}
          >
            {props.isTouchDevice ? null : (
              <button className="drag__icon" {...provided.dragHandleProps}>
                <HiSwitchVertical />
              </button>
            )}
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
      }}
    </Draggable>
  );
}
