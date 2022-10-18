import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: JSON.parse(localStorage.getItem("todos")) || [],
};

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
    addTodo: (state, action) => {
      state.todos.push(action.payload);
    },
    changeTodo: (state, action) => {
      const { uid, ...todo } = action.payload;
      state.todos = state.todos.map((t) => {
        if (t.uid !== uid) return t;
        return { ...t, ...todo };
      });
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((t) => t.uid !== action.payload);
    },
  },
});

export const { setTodos, addTodo, changeTodo, deleteTodo } = todosSlice.actions;

export default todosSlice.reducer;

export const selectTodos = (state) => state.todos.todos;
