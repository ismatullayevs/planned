import { apiSlice } from "../../app/api/apiSlice";

export const todosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loadTodos: builder.query({
      query: () => ({
        url: "/api/todos/",
      }),
    }),
    createTodo: builder.mutation({
      query: (task) => ({
        url: "/api/todos/",
        method: "POST",
        body: { task },
      }),
    }),
    loadTodo: builder.query({
      query: (id) => ({
        url: `/api/todos/${id}/`,
      }),
    }),
    updateTodo: builder.mutation({
      query: ({ id, ...todo }) => ({
        url: `/api/todos/${id}/`,
        method: "PATCH",
        body: { ...todo },
      }),
    }),
    destroyTodo: builder.mutation({
      query: (id) => ({
        url: `/api/todos/${id}/`,
        method: "DELETE",
      }),
    }),
    reorderTodo: builder.mutation({
      query: ({ direction, count, current_id }) => ({
        url: `/api/todos/${current_id}/reorder/`,
        method: "PATCH",
        params: { direction, count },
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
