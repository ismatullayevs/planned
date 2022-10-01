import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loadUser: builder.query({
      query: () => ({
        url: "/api/users/me/",
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/jwt/create",
        method: "POST",
        body: body,
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/users/",
        method: "POST",
        body: body,
      }),
    }),
    activate: builder.mutation({
      query: (body) => ({
        url: "/auth/users/activation/",
        method: "POST",
        body: body,
      }),
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: "/api/users/me/",
        method: "PUT",
        body: body,
      }),
    }),
    loginWithGoogle: builder.query({
      query: () => ({
        url: "/auth/o/google-oauth2/",
        method: "GET",
        params: { redirect_uri: `${process.env.REACT_APP_URL}/login` },
        credentials: "include",
      }),
    }),
    activateWithGoogle: builder.mutation({
      query: ({ state, code }) => ({
        url: "/auth/o/google-oauth2/",
        method: "POST",
        params: { state, code },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
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
  useLazyLoginWithGoogleQuery,
  useActivateWithGoogleMutation,
} = authApiSlice;
