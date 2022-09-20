import { useEffect, useCallback } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { nanoid } from "nanoid";
import Form from "./Form";
import TodoItem from "./TodoItem";
import "./TodoApp.scss";
import { Link } from "react-router-dom";
import { logOut } from "../auth/authSlice";
import { useDispatch } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import { useSelector } from "react-redux";
import {
  selectTodos,
  setTodos,
  addTodo,
  changeTodo,
  deleteTodo,
} from "./todosSlice";
import {
  useLazyLoadTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDestroyTodoMutation,
} from "./todosApiSlice";

library.add(fas);

function TodoApp() {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user?.id;
  const [trigger] = useLazyLoadTodosQuery();
  const [createTodo] = useCreateTodoMutation();
  const [destroyTodo] = useDestroyTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const dispatch = useDispatch();

  const getTodos = useCallback(async () => {
    try {
      const response = await trigger().unwrap();
      dispatch(setTodos(response.results));
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, trigger]);

  useEffect(() => {
    if (isAuthenticated) {
      getTodos();
    } else {
    }
  }, [dispatch, getTodos, isAuthenticated]);

  const todos = useSelector(selectTodos);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [isAuthenticated, todos]);

  const onFormSubmit = async (value) => {
    dispatch(addTodo({ id: nanoid(), task: value, completed: false }));
    if (isAuthenticated) {
      try {
        await createTodo(value).unwrap();
        getTodos();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onTodoChange = async (e, id) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    dispatch(changeTodo({ id, [e.target.name]: val }));
    if (isAuthenticated) {
      try {
        await updateTodo({ id, [e.target.name]: val }).unwrap();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onTodoDelete = async (id) => {
    dispatch(deleteTodo(id));
    if (isAuthenticated) {
      try {
        await destroyTodo(id).unwrap();
        getTodos();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <div className="TodoApp clearfix">
      <div className="todo">
        <h2 className="todo__title">Todo</h2>
        <Form onSubmit={onFormSubmit} />
        <TransitionGroup className="todo__list">
          {todos.map((todo) => (
            <CSSTransition timeout={300} key={todo.id} classNames="todo">
              <TodoItem
                todo={todo}
                onChange={onTodoChange}
                onDelete={onTodoDelete}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
        <div className="todo__footer">
          {isAuthenticated ? (
            <p>
              Hello, <span className="white">{user.email}</span>. Please don't{" "}
              <button onClick={handleLogout} style={{ color: "white" }}>
                logout
              </button>
            </p>
          ) : (
            <p>
              To save your results, <Link to="/login">Log in</Link> or{" "}
              <Link to="/signup">Sign up</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
