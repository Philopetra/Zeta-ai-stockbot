import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
	theme: Cookies.get("theme") || "light", // Read from cookies
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		toggleTheme: (state) => {
			const newTheme = state.theme === "light" ? "dark" : "light";
			state.theme = newTheme;
			Cookies.set("theme", newTheme); // Set cookie
		},
	},
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
