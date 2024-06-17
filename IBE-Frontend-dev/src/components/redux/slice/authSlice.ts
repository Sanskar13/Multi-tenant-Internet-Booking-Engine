import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
	isLoggedIn: boolean;
	username: string | null;
}

const initialState: AuthState = {
	isLoggedIn: false,
	username: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setLoggedIn(state, action: PayloadAction<boolean>) {
			state.isLoggedIn = action.payload;
		},
		setUsername(state, action: PayloadAction<string | null>) {
			state.username = action.payload;
		},
	},
});

export const { setLoggedIn, setUsername } = authSlice.actions;

export default authSlice.reducer;
