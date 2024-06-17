import { createSlice } from "@reduxjs/toolkit";

const dateSlice = createSlice({
	name: "date",
	initialState: {
		startDate: null,
		endDate: null,
	},
	reducers: {
		setStartDate(state, action) {
			state.startDate = action.payload;
		},
		setEndDate(state, action) {
			state.endDate = action.payload;
		},
	},
});

export const { setStartDate, setEndDate } = dateSlice.actions;

export const selectStartDate = (state: { date: { startDate: any; }; }) => state.date.startDate;
export const selectEndDate = (state: { date: { endDate: any; }; }) => state.date.endDate;

export default dateSlice.reducer;
