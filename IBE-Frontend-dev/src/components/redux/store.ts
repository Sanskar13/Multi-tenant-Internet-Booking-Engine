import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import apiReducer from "./slice/apiSlice";
import languageReducer from "./slice/languageSlice";
import roomReducer from "./slice/roomSlice";
import searchReducer from "./slice/searchSlice";
import promotionReducer from "./slice/promotionSlice";
import promoCodeReducer from "./slice/promoCodeSlice";
import feedbackReducer from "./slice/feedbackSlice";
import dateReducer from "./slice/dateSlice";
import emailReducer from "./slice/EmailSlice";
import checkoutReducer from "./slice/CheckoutSlice";
import roomrateReducer from "./slice/RoomRateSlice";
import authReducer from "./slice/authSlice";
import PurchaseReducer from "./slice/PurchaseSlice";
import walletReducer from "./slice/totalSumSlice";

export const store = configureStore({
	reducer: {
		apiGraphQL: apiReducer,
		language: languageReducer,
		room: roomReducer,
		search: searchReducer,
		promotion: promotionReducer,
		promoCode: promoCodeReducer,
		feedback: feedbackReducer,
		date: dateReducer,
		email: emailReducer,
		selectedRoom: checkoutReducer,
		roomRatesSlice: roomrateReducer,
		auth: authReducer,
		purchases: PurchaseReducer,
		totalSum: walletReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
