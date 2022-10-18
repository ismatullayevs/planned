import React, { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { addTodo } from "./todosSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import { useCreateTodoMutation } from "./todosApiSlice";
import useGetTodos from "./useGetTodos";

export default function TodoForm(props) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem("currentTodo") || "";
  });
  const inputRef = useRef(true);
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user?.id;
  const [createTodo] = useCreateTodoMutation();
  const getTodos = useGetTodos();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem("currentTodo", value);
  }, [value]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (value === "") return;
    let todo = { uid: nanoid(), task: value, completed: false };
    dispatch(addTodo(todo));

    if (isAuthenticated) {
      try {
        await createTodo(todo).unwrap();
        console.log(todo);
      } catch (err) {
        console.log(err);
      } finally {
        getTodos();
      }
    }
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
      <button className="form__submit" type="submit" disabled={!value}>
        Add
      </button>
    </form>
  );
}
