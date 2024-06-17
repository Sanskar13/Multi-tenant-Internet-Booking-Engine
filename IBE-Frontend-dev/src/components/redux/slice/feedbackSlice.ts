import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Feedback {
	propertyId: number;
	roomTypeId: number;
	rating: number;
	review: string;
}

interface FeedbackState {
	feedbackList: Feedback[];
	showItinerary: boolean;
	selectedProperties: number;
	selectedRoom: number;
}

const initialState: FeedbackState = {
	feedbackList: [],
	showItinerary: false,
	selectedProperties: 14,
	selectedRoom: 80,
};

export const submitFeedback = createAsyncThunk(
	"feedback/submit",
	async ({
		propertyId,
		roomTypeId,
		rating,
	}: Pick<Feedback, "propertyId" | "roomTypeId" | "rating">) => {
		const requestBody = {
			propertyId,
			roomTypeId,
			rating,
		};
		const response = await fetch(
			"https://team14-ibe-kdu24.azurewebsites.net/property-rating-review",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			}
		);

		if (!response.ok) {
			throw new Error("Failed to submit feedback");
		}

		return await response.json();
	}
);

const feedbackSlice = createSlice({
	name: "feedback",
	initialState,
	reducers: {
		feedbackSubmitted(state, action: PayloadAction<Feedback>) {
			state.feedbackList.push(action.payload);
		},
		setShowItinerary: (state, action: PayloadAction<boolean>) => {
			state.showItinerary = action.payload;
		},
		setSelectedProperties: (state, action: PayloadAction<number>) => {
			state.selectedProperties = action.payload;
		},
		setSelectedRooms: (state, action: PayloadAction<number>) => {
			state.selectedRoom = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(submitFeedback.pending, (state, action) => {});
		builder.addCase(submitFeedback.fulfilled, (state, action) => {
			state.feedbackList.push(action.payload);
		});
		builder.addCase(submitFeedback.rejected, (state, action) => {
			console.error("Failed to submit feedback:", action.error);
		});
	},
});

export const {
	feedbackSubmitted,
	setSelectedProperties,
	setSelectedRooms,
	setShowItinerary,
} = feedbackSlice.actions;

export const setSelectedRoomss = (state: RootState) =>
	state.feedback.selectedRoom;

export default feedbackSlice.reducer;
