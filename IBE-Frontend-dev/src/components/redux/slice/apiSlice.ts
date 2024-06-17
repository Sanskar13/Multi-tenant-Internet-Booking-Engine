import { createSlice } from "@reduxjs/toolkit";

interface RoomState {
  rooms: string[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  rooms: [],
  loading: false,
  error: null,
};

const apiSlice = createSlice({
  name: "apiGraphQL",
  initialState,
  reducers: {
    fetchRoomPending(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRoomSuccess(state, action) {
      state.rooms = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchRoomFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchRoomPending, fetchRoomSuccess, fetchRoomFailure } =
  apiSlice.actions;

export default apiSlice.reducer;
