import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	userChats: [],
	loading: false,
	error: null,
	currentChat: null,
};

const chatsSlice = createSlice({
	name: "userChats",
	initialState,
	reducers: {
		setUserChats: (state, action) => {
			state.userChats = action.payload;
			state.loading = false;
		},
		setCurrentChat: (state, action) => {
			state.currentChat = action.payload;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		},
	},
});

export const { setUserChats, setCurrentChat, setLoading, setError } =
	chatsSlice.actions;

export default chatsSlice.reducer;
