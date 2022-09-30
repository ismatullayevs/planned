import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") || "default",
  isDark: null,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setIsDark: (state, action) => {
      state.isDark = action.payload;
    },
  },
});

export const { setTheme, setIsDark } = settingsSlice.actions;

export const selectTheme = (state) => state.settings.theme;
export const selectIsDark = (state) => state.settings.isDark;

export default settingsSlice.reducer;
