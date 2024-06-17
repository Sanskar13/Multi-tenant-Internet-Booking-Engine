import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SearchState {
  startDate: Date;
  endDate: Date;
  selectedProperties: string[];
  numberOfRooms: number;
  wheelchairAccessible: boolean;
  adultsCount: number;
  kidsCount: number;
  teensCount: number;
}

const initialState: SearchState = {
  startDate: new Date(),
  endDate: new Date(),
  selectedProperties: [],
  numberOfRooms: 1,
  wheelchairAccessible: false,
  adultsCount: 0,
  kidsCount: 0,
  teensCount: 0,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchParams(state, action: PayloadAction<SearchState>) {
      localStorage.setItem("searchParams", JSON.stringify(action.payload));
      localStorage.setItem("startDate", JSON.stringify(action.payload.startDate));
      return action.payload;
    },
  },
});

export const selectStartDate = (state: RootState) => state.search.startDate;
export const selectEndDate = (state: RootState) => state.search.endDate;
export const { setSearchParams } = searchSlice.actions;
export default searchSlice.reducer;
