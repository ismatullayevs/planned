import { useEffect, useCallback } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { nanoid } from "nanoid";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useDispatch } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import { useSelector } from "react-redux";
import checkTouchDevice from "../../helpers/checkTouchDevice";

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
  useReorderTodoMutation,
} from "./todosApiSlice";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

library.add(fas);

function TodoApp() {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user?.id;
  const [trigger] = useLazyLoadTodosQuery();
  const [createTodo] = useCreateTodoMutation();
  const [destroyTodo] = useDestroyTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const dispatch = useDispatch();
  const isTouchDevice = checkTouchDevice();
  const [reorderTodo] = useReorderTodoMutation();

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
      localStorage.removeItem("todos");
    } else {
      dispatch(setTodos(JSON.parse(localStorage.getItem("todos")) || []));
    }
  }, [dispatch, getTodos, isAuthenticated]);

  const todos = useSelector(selectTodos);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [isAuthenticated, todos]);

  const onFormSubmit = async (value) => {
    if (isAuthenticated) {
      try {
        await createTodo(value).unwrap();
        getTodos();
      } catch (err) {
        console.log(err);
      }
    } else {
      dispatch(addTodo({ id: nanoid(), task: value, completed: false }));
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

  const handleDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newTodos = Array.from(todos);
    const currentTodo = newTodos.splice(source.index, 1)[0];
    const currentId = currentTodo.id;
    newTodos.splice(destination.index, 0, currentTodo);
    dispatch(setTodos(newTodos));

    if (isAuthenticated) {
      const count = source.index - destination.index;
      const direction = count > 0 ? "up" : "down";
      try {
        await reorderTodo({
          direction,
          current_id: currentId,
          count: Math.abs(count),
        }).unwrap();
        getTodos();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="todoApp">
      <TodoForm onSubmit={onFormSubmit} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable-1">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <TransitionGroup className="todo__list todo__active">
                {todos.map((todo, index) => (
                  <CSSTransition timeout={200} key={todo.id} classNames="todo">
                    <TodoItem
                      todo={todo}
                      onDelete={onTodoDelete}
                      onChange={onTodoChange}
                      index={index}
                      isTouchDevice={isTouchDevice}
                    />
                  </CSSTransition>
                ))}
              </TransitionGroup>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default TodoApp;
