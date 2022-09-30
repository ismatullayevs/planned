import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loadUser: builder.query({
      query: () => ({
        url: "/api/users/me/",
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/jwt/create",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/users/",
        method: "POST",
        body: credentials,
      }),
    }),
    activate: builder.mutation({
      query: (credentials) => ({
        url: "/auth/users/activation/",
        method: "POST",
        body: credentials,
      }),
    }),
    updateUser: builder.mutation({
      query: (credentials) => ({
        url: "/api/users/me/",
        method: "PUT",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useActivateMutation,
  useLazyLoadUserQuery,
  useLoadUserQuery,
  useUpdateUserMutation,
} = authApiSlice;
