import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const totalSumSlice = createSlice({
	name: "totalSum",
	initialState: {
		email: "",
		amount: 0,
	},
	reducers: {
		setTotalSum: (state, action) => {
			state.email = action.payload.email;
			state.amount = action.payload.totalSum;
		},
	},
});

export const { setTotalSum } = totalSumSlice.actions;

export const selectEmail = (state: RootState) => state.totalSum.email;
export const selectAmount = (state: RootState) => state.totalSum.amount;

export default totalSumSlice.reducer;
