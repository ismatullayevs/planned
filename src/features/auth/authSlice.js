import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  access: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.access = action.payload;
    },
    logOut: (state, action) => {
      state.user = null;
      state.access = null;
    },
  },
});

export const { setUser, setToken, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;

export const selectCurrentToken = (state) => state.auth.access;
