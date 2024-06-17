export interface SelectedRoom {
	room_id: number;
	roomTypeName: string;
}

export interface SelectedPromoCode {
	name: string;
	price: number;
}

export interface SelectedPackage {
	room: SelectedRoom;
	promoCode?: SelectedPromoCode;
}

export interface SelectedRoomState {
	selectedPackage: SelectedPackage | null;
}

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RoomRate } from "./RoomRateSlice";

export const fetchBookingData = createAsyncThunk(
	"selectedRoom/fetchBookingData",
	async () => {
		try {
			const response = await axios.get(
				"https://team14-ibe-kdu24.azurewebsites.net/purchases"
			);
			return response.data;
		} catch (error) {
			throw error;
		}
	}
);
export interface Itinerary {
	startDate: Date;
	endDate: Date;
	nightlyRate: number;
	totalAmount: number;
	promocodeSpecialPrice: number;
	subtotal: number;
	taxAmount: number;
	vatAmount: number;
	totalPrice: number;
	roomname: string;
}
export interface TravellerInfo {
	travelfirstName: string;
	travellastName: string;
	travelphone: string;
	travelemail: string;
}

export interface BillingInfo {
	billingFirstName: string;
	billingLastName: string;
	address1: string;
	address2: string;
	country: string;
	state: string;
	city: string;
	zip: string;
	billingPhone: string;
	billingEmail: string;
}

export interface PaymentInfo {
	cardNumber: string;
	expMonth: string;
	expYear: string;
}

export interface SelectedRoomState {
	travelerInfo: TravellerInfo;
	billingInfo: BillingInfo;
	paymentInfo: PaymentInfo;
	itinerary: Itinerary | null;
}

const initialRoomState: SelectedRoomState = {
	travelerInfo: {
		travelfirstName: "",
		travellastName: "",
		travelphone: "",
		travelemail: "",
	},
	billingInfo: {
		billingFirstName: "",
		billingLastName: "",
		address1: "",
		address2: "",
		country: "",
		state: "",
		city: "",
		zip: "",
		billingPhone: "",
		billingEmail: "",
	},
	paymentInfo: {
		cardNumber: "",
		expMonth: "",
		expYear: "",
	},
	itinerary: null,
	selectedPackage: null,
};

const selectedRoomSlice = createSlice({
	name: "selectedRoom",
	initialState: initialRoomState,
	reducers: {
		setTravelerInfo(state, action: PayloadAction<TravellerInfo>) {
			state.travelerInfo = action.payload;
		},
		setBillingInfo(state, action: PayloadAction<BillingInfo>) {
			state.billingInfo = action.payload;
		},
		setPaymentInfo(state, action: PayloadAction<PaymentInfo>) {
			state.paymentInfo = action.payload;
		},

		setSelectedPackage(state, action: PayloadAction<SelectedRoom>) {
			state.selectedPackage = action.payload;
		},
		setItinerary(state, action: PayloadAction<Itinerary>) {
			state.itinerary = action.payload;
		},
		setPackageCode(state, action: PayloadAction<SelectedPromoCode>) {
			if (state.selectedPackage) {
				state.selectedPackage.promoCode = {
					name: action.payload.name,
					price: action.payload.price,
				};
			}
		},
		clearSelectedPackage(state) {
			state.selectedPackage = null;
		},
		clearPromoCode(state) {
			if (state.selectedPackage) {
				state.selectedPackage.promoCode = undefined;
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchBookingData.fulfilled, (state, action) => {
			const [bookingData] = action.payload;
			state.travelerInfo = {
				travelfirstName: bookingData.travelfirstName,
				travellastName: bookingData.travellastName,
				travelphone: bookingData.travelphone,
				travelemail: bookingData.travelemail,
			};
			state.billingInfo = {
				billingFirstName: bookingData.billingfirstName,
				billingLastName: bookingData.billinglastName,
				address1: bookingData.address1,
				address2: bookingData.address2,
				country: bookingData.country,
				state: bookingData.state,
				city: bookingData.city,
				zip: bookingData.zip,
				billingPhone: bookingData.billingphone,
				billingEmail: bookingData.billingemail,
			};
			state.paymentInfo = {
				cardNumber: bookingData.cardNumber,
				expMonth: bookingData.expMonth,
				expYear: bookingData.expYear,
			};
		});
	},
});

export const {
	setSelectedPackage,
	setPackageCode,
	clearSelectedPackage,
	clearPromoCode,
	setTravelerInfo,
	setBillingInfo,
	setPaymentInfo,
	setItinerary,
} = selectedRoomSlice.actions;
export default selectedRoomSlice.reducer;
