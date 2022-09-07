import { useState, useEffect } from "react";
import "./App.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Form from "./components/Form";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import TodoItem from "./components/TodoItem";

library.add(fas);

function App() {
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem("todos")) || [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const onFormSubmit = (value) => {
    const nextId = Math.max(...todos.map((t) => t.id), 0) + 1;
    setTodos([...todos, { id: nextId, text: value, completed: false }]);
  };

  const onTodoChange = (e, id) => {
    setTodos(
      todos.map((t) => {
        if (t.id !== id) {
          return t;
        }
        const val =
          e.target.type === "checkbox" ? e.target.checked : e.target.value;
        return { ...t, [e.target.name]: val };
      })
    );
  };

  const onTodoDelete = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="App">
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
      </div>
    </div>
  );
}

export default App;
