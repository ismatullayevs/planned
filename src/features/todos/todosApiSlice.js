import { apiSlice } from "../../app/api/apiSlice";

export const todosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loadTodos: builder.query({
      query: () => ({
        url: "/core/todos/",
      }),
    }),
    createTodo: builder.mutation({
      query: (task) => ({
        url: "/core/todos/",
        method: "POST",
        body: { task },
      }),
    }),
    loadTodo: builder.query({
      query: (id) => ({
        url: `/core/todos/${id}/`,
      }),
    }),
    updateTodo: builder.mutation({
      query: ({ id, ...todo }) => ({
        url: `/core/todos/${id}/`,
        method: "PATCH",
        body: { ...todo },
      }),
    }),
    destroyTodo: builder.mutation({
      query: (id) => ({
        url: `/core/todos/${id}/`,
        method: "DELETE",
      }),
    }),
    reorderTodo: builder.mutation({
      query: ({ direction, count, current_id }) => ({
        url: `/core/todos/${current_id}/reorder/`,
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
