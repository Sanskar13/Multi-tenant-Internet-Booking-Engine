import { createSlice } from "@reduxjs/toolkit";

const purchasesSlice = createSlice({
  name: "purchases",
  initialState: [],
  reducers: {
    setPurchase(state, action) {
      return action.payload;
    },
  },
});

export const { setPurchase } = purchasesSlice.actions;

export default purchasesSlice.reducer;
