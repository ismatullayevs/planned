import React, { useRef } from "react";
import classNames from "classnames";
import { BsTrash, BsCheck } from "react-icons/bs";
import { HiSwitchVertical } from "react-icons/hi";
import { Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { changeTodo, deleteTodo } from "./todosSlice";
import { selectCurrentUser } from "../auth/authSlice";
import { useUpdateTodoMutation, useDestroyTodoMutation } from "./todosApiSlice";
import useGetTodos from "./useGetTodos";
import lockAxisY from "../../helpers/lockAxisY";
import _ from "lodash";

export default function TodoItem(props) {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user?.id;
  const todo = props.todo;
  const dispatch = useDispatch();
  const [updateTodo] = useUpdateTodoMutation();
  const [destroyTodo] = useDestroyTodoMutation();
  const getTodos = useGetTodos();

  const handleApiChange = async (e, val) => {
    try {
      await updateTodo({ id: todo.id, [e.target.name]: val }).unwrap();
    } catch (err) {
      console.log(err);
    }
  };
  let handleDebouncedApiChange = useRef(_.debounce(handleApiChange, 400));

  const handleChange = async (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    dispatch(changeTodo({ uid: todo.uid, [e.target.name]: val }));

    if (isAuthenticated) {
      if (e.target.name === "task") handleDebouncedApiChange.current(e, val);
      else handleApiChange(e, val);
    }
  };

  const handleDelete = async () => {
    dispatch(deleteTodo(todo.uid));
    if (isAuthenticated) {
      try {
        await destroyTodo(todo.id).unwrap();
      } catch (err) {
        console.log(err);
      } finally {
        getTodos();
      }
    }
  };

  const handleBlur = (e) => {
    const id = todo.id;
    if (e.target.value === "" && e.target.type === "text") {
      handleDelete(id);
    }
  };

  return (
    <Draggable draggableId={todo.uid} index={props.index}>
      {(provided, snapshot) => {
        const containerProps = props.isTouchDevice && provided.dragHandleProps;
        return (
          <div
            className={classNames("item", { completed: todo.completed })}
            {...provided.draggableProps}
            ref={provided.innerRef}
            style={lockAxisY(provided.draggableProps.style, snapshot)}
            {...containerProps}
          >
            {props.isTouchDevice ? null : (
              <button
                className="drag__icon"
                {...provided.dragHandleProps}
                tabIndex="-1"
              >
                <HiSwitchVertical />
              </button>
            )}
            <div className="item__left">
              <label htmlFor={`todo-${todo.uid}`} className="item__completed">
                <input
                  id={`todo-${todo.uid}`}
                  className="item__checkbox"
                  type="checkbox"
                  name="completed"
                  checked={todo.completed}
                  onChange={handleChange}
                  tabIndex={-1}
                />
                <BsCheck className="checked__icon" />
              </label>
              <input
                className="item__input"
                type="text"
                name="task"
                value={todo.task}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <BsTrash className="delete__icon" onClick={handleDelete} />
          </div>
        );
      }}
    </Draggable>
  );
}
