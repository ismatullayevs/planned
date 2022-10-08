import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loadUser: builder.query({
      query: () => ({
        url: "/core/users/me/",
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/core/jwt/create/",
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
        url: "/core/users/me/",
        method: "PUT",
        body: body,
      }),
    }),
    changePassword: builder.mutation({
      query: ({ current_password, new_password }) => ({
        url: "/auth/users/set_password/",
        method: "POST",
        body: { current_password, new_password },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/users/reset_password/",
        method: "POST",
        body: { email },
      }),
    }),
    resetPasswordConfirm: builder.mutation({
      query: ({ uid, token, new_password }) => ({
        url: "/auth/users/reset_password_confirm/",
        method: "POST",
        body: { uid, token, new_password },
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
  useChangePasswordMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
} = authApiSlice;
