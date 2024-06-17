import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";


interface PromotionSearchParams {
	page: number;
	size: number;
	seniorCitizen: boolean;
	kduMembership: boolean;
	longWeekendDiscount: boolean;
	militaryPersonnelDiscount: boolean;
	upfrontPaymentDiscount: boolean;
	weekendDiscount: boolean;
  }
  
  const initialSearchParams: PromotionSearchParams = {
	page: 1,
	size: 6,
	seniorCitizen: true,
	kduMembership: true,
	longWeekendDiscount: false,
	militaryPersonnelDiscount: true,
	upfrontPaymentDiscount: false,
	weekendDiscount: false,
  };


export const fetchPromotions = createAsyncThunk("fetchPromotions", async (searchParams: PromotionSearchParams, { rejectWithValue }) => {
	const response = await fetch(
		`https://team14-ibe-kdu24.azurewebsites.net/api/promotions?page=${searchParams.page}&size=${searchParams.size}&seniorCitizen=${searchParams.seniorCitizen}&kduMembership=${searchParams.kduMembership}&longWeekendDiscount=${searchParams.longWeekendDiscount}&militaryPersonnelDiscount=${searchParams.militaryPersonnelDiscount}&upfrontPaymentDiscount=${searchParams.upfrontPaymentDiscount}&weekendDiscount=${searchParams.weekendDiscount}`

		);


	const data = await response.json();
	return data;
});

export interface Promotion {
	promotionDescription: string;
	promotionId: number;
	promotionTitle: string;
	minimumDaysOfStay: number;
	priceFactor: number;
	deactivated: boolean;
}

interface PromotionsState {
	promotions: Promotion[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

const initialState: PromotionsState = {
	promotions: [],
	status: "idle",
	error: null,
};

export const promotionsSlice = createSlice({
	name: "promotions",
	initialState,
	reducers: {
		setPromotions: (state, action) => {
			state.promotions = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPromotions.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchPromotions.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.promotions = action.payload;
			})
			.addCase(fetchPromotions.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message ?? "An error occurred.";
			});
	},
});

export const selectPromotions = (state: RootState) =>
	state.promotion.promotions;
export const { setPromotions } = promotionsSlice.actions;

export default promotionsSlice.reducer;
