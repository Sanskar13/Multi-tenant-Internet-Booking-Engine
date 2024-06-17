import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";

interface LanguageState {
	selectedLanguage: string;
	selectedCurrency: string;
	guestDropdownOptions: string[];
	roomDropdownOptions: number[];
	propertyRates: { [key: string]: number };
	wheelchairAccessible: boolean;
	amenities: string[];
	description: string;
}

const initialState: LanguageState = {
	selectedLanguage: "en",
	selectedCurrency: "USD",
	guestDropdownOptions: [],
	roomDropdownOptions: [],
	propertyRates: {},
	wheelchairAccessible: false,
	amenities: [],
	description: "",
};

export const languageSlice = createSlice({
	name: "language",
	initialState,
	reducers: {
		setLanguage: (state, action: PayloadAction<string>) => {
			state.selectedLanguage = action.payload;
		},
		setCurrency: (state, action: PayloadAction<string>) => {
			state.selectedCurrency = action.payload;
		},
		setGuestDropdownOptions: (state, action: PayloadAction<string[]>) => {
			state.guestDropdownOptions = action.payload;
		},
		setRoomDropdownOptions: (state, action: PayloadAction<number[]>) => {
			state.roomDropdownOptions = action.payload;
		},
		setPropertyRates: (
			state,
			action: PayloadAction<{ [key: string]: number }>
		) => {
			state.propertyRates = action.payload;
		},
		setWheelchairAccessible(state, action: PayloadAction<boolean>) {
			state.wheelchairAccessible = action.payload;
		},
		setAmenities(state, action: PayloadAction<string[]>) {
			state.amenities = action.payload;
		},
		setDescription(state, action: PayloadAction<string>) {
			state.description = action.payload;
		},
	},
});

export const {
	setLanguage,
	setCurrency,
	setGuestDropdownOptions,
	setRoomDropdownOptions,
	setPropertyRates,
	setWheelchairAccessible,
	setAmenities,
	setDescription,
} = languageSlice.actions;

export const selectLanguage = (state: RootState) =>
	state.language.selectedLanguage;
export const selectCurrency = (state: RootState) =>
	state.language.selectedCurrency;
export const selectWheelchairAccessible = (state: RootState) =>
	state.language.wheelchairAccessible;
export default languageSlice.reducer;

export const fetchConfigData = (): AppThunk => async (dispatch) => {
	try {
		const response = await fetch(
			"https://team14-ibe-kdu24.azurewebsites.net/api/config"
		);
		if (!response.ok) {
			throw new Error("Failed to fetch config data");
		}
		const jsonData = await response.json();
		dispatch(setGuestDropdownOptions(jsonData.guestTypes));
		dispatch(setRoomDropdownOptions(jsonData.roomCountOptions));
		dispatch(setAmenities(jsonData.amenities));
		dispatch(setDescription(jsonData.description));
	} catch (error) {
		console.error("Error fetching config data:", error);
	}
};

export const fetchPropertyRates = (): AppThunk => async (dispatch) => {
	try {
		const response = await fetch(
			"https://team14-ibe-kdu24.azurewebsites.net/api/property-rates"
		);
		if (!response.ok) {
			throw new Error("Failed to fetch property rates");
		}
		const data = await response.json();
		dispatch(setPropertyRates(data));
	} catch (error) {
		console.error("Error fetching property rates:", error);
	}
};
