import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface Promotion {
	deactivated: boolean;
	minimumDaysOfStay: number;
	priceFactor: number;
	promotionDescription: string;
	promotionId: number;
	promotionTitle: string;
}

export interface RoomRate {
	date: string;
	nightlyRate: number;
}

export interface RoomRatesState {
	roomRates: RoomRate[];
	loading: boolean;
	error: string | null;
	promotion: Promotion | null;
}

export interface FetchRoomRatesPayload {
	roomTypeId: number;
	startDate: string;
	endDate: string;
}

export const fetchRoomRates = createAsyncThunk(
	"roomRates/fetchRoomRates",
	async (payload: FetchRoomRatesPayload) => {
		const { roomTypeId, startDate, endDate } = payload;
		const response = await axios.get(
			`https://team14-ibe-kdu24.azurewebsites.net/room-rates?roomTypeId=${roomTypeId}&startDate=${startDate}&endDate=${endDate}`
		);

		return response.data;
	}
);

const roomRatesSlice = createSlice({
	name: "roomRates",
	initialState: {
		roomRates: [],
		loading: false,
		error: null,
		promotion: null,
	} as RoomRatesState,
	reducers: {
		setPromotionData: (state, action: PayloadAction<Promotion>) => {
			state.promotion = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRoomRates.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchRoomRates.fulfilled, (state, action) => {
				state.loading = false;
				state.roomRates = [];
				for (const date in action.payload) {
					if (Object.prototype.hasOwnProperty.call(action.payload, date)) {
						const nightlyRate = parseFloat(action.payload[date]);
						state.roomRates.push({ date, nightlyRate });
					}
				}
				localStorage.setItem("roomRates", JSON.stringify(state.roomRates));
			})
			.addCase(fetchRoomRates.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export const selectRoomRates = (state: RootState) =>
	state.roomRatesSlice.roomRates;
export const { setPromotionData } = roomRatesSlice.actions;

export default roomRatesSlice.reducer;
