import { apiSlice } from "../../app/api/apiSlice";

export const todosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loadTodos: builder.query({
      query: () => ({
        url: "/core/todos/",
      }),
    }),
    createTodo: builder.mutation({
      query: ({ uid, task }) => ({
        url: "/core/todos/",
        method: "POST",
        body: { uid, task },
      }),
    }),
    loadTodo: builder.query({
      query: (id) => ({
        url: `/core/todos/${id}/`,
      }),
    }),
    updateTodo: builder.mutation({
      query: ({ id, task, completed }) => ({
        url: `/core/todos/${id}/`,
        method: "PATCH",
        body: { task, completed },
      }),
    }),
    destroyTodo: builder.mutation({
      query: (id) => ({
        url: `/core/todos/${id}/`,
        method: "DELETE",
      }),
    }),
    reorderTodo: builder.mutation({
      query: ({ count, current_id }) => ({
        url: `/core/todos/${current_id}/reorder/`,
        method: "PATCH",
        params: { count },
      }),
    }),
  }),
});

export const {
  useLoadTodosQuery,
  useLazyLoadTodosQuery,
  useLoadTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDestroyTodoMutation,
  useReorderTodoMutation,
} = todosApiSlice;
