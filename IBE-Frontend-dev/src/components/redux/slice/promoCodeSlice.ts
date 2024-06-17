import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const validatePromoCode = createAsyncThunk(
  "validatePromoCode",
  async (promoCode: string) => {
    const response = await fetch(`https://team14-ibe-kdu24.azurewebsites.net/validatepromocode?promoCode=${promoCode}`, {
      method: "POST",
    });
    const data = await response.json();
    return data;
  }
);

export interface PromoCodeResponseDTO {
  isValid: boolean;
  promocode: string;
  discount: number;
}

interface PromoCodeState {
  promoCodeResponse: PromoCodeResponseDTO | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PromoCodeState = {
  promoCodeResponse: null,
  status: "idle",
  error: null,
};

export const promoCodeSlice = createSlice({
  name: "promoCode",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(validatePromoCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(validatePromoCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.promoCodeResponse = action.payload;
      })
      .addCase(validatePromoCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred.";
      });
  },
});

export const selectPromoCodeResponse = (state: RootState) =>
  state.promoCode.promoCodeResponse;

export default promoCodeSlice.reducer;