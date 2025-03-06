import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
	user: null,
	isAuthenticated: false,
	loading: false,
	error: null,
	model: {
		active: "groq",
		name: "llama3-8b-8192",
	},
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUserInStore: (state, action) => {
			Cookies.set("userUid", action.payload.uid, { expires: 1 });
			state.user = action.payload;
			state.isAuthenticated = !!action.payload;
			state.loading = false;
			state.error = null;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		},
		logout: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.loading = false;
			state.error = null;
		},
		setActiveModel: (state, action) => {
			state.model.active = action.payload;
		},
	},
});

export const { setUserInStore, logout, setActiveModel } = authSlice.actions;
export default authSlice.reducer;
