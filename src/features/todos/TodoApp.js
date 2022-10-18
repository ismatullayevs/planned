import { useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import checkTouchDevice from "../../helpers/checkTouchDevice";
import useGetTodos from "./useGetTodos";
import { selectTodos, setTodos } from "./todosSlice";
import { useReorderTodoMutation } from "./todosApiSlice";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function TodoApp() {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user?.id;
  const dispatch = useDispatch();
  const isTouchDevice = checkTouchDevice();
  const [reorderTodo] = useReorderTodoMutation();
  const getTodos = useGetTodos();

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

  const handleDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newTodos = Array.from(todos);
    const currentTodo = newTodos.splice(source.index, 1)[0];
    const current_id = currentTodo.id;
    newTodos.splice(destination.index, 0, currentTodo);
    dispatch(setTodos(newTodos));

    if (isAuthenticated) {
      let count = source.index - destination.index;
      try {
        await reorderTodo({ current_id, count }).unwrap();
        getTodos();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="todoApp">
      <TodoForm />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable-1">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <TransitionGroup className="todo__list todo__active">
                {todos.map((todo, index) => (
                  <CSSTransition timeout={200} key={todo.uid} classNames="todo">
                    <TodoItem
                      todo={todo}
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
