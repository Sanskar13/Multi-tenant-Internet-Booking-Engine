import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const locations = [
  "New York",
  "Los Angeles",
  "London",
  "Paris",
  "Tokyo",
  "Sydney",
];

const getRandomLocation = () => {
  const randomIndex = Math.floor(Math.random() * locations.length);
  return locations[randomIndex];
};

interface ApiRoom {
  roomTypeId: number;
  roomTypeName: string;
  areaInSquareFeet: number;
  singleBed: number;
  doubleBed: number;
  maxCapacity: number;
  ratings: number;
  reviews: number;
  location?: string;
  deal?: string;
  price?: number;
}

export interface FetchRoomsParams {
  page?: number;
  pageSize?: number;
  singleBed?: boolean;
  superDeluxe?: boolean;
  familyDeluxe?: boolean;
  price?: number;
}

export const fetchRooms = createAsyncThunk(
  "fetchRooms",
  async (
    {
      page = 1,
      pageSize = 6,
      singleBed = false,
      superDeluxe = false,
      familyDeluxe = false,
      price = 1000,
    }: FetchRoomsParams = {},
    { getState }
  ) => {
    let url = `https://team14-ibe-kdu24.azurewebsites.net/api/room-types?page=${page}&size=${pageSize}`;
    // let url = `http://localhost:8081/api/room-types?page=${page}&size=${pageSize}`;
    if (singleBed) {
      url += "&singleBed=true";
    }
    if (superDeluxe) {
      url += "&superDeluxe=true";
    }
    if (familyDeluxe) {
      url += "&familyDeluxe=true";
    }

    const response = await fetch(url);
    const data = await response.json();
    let rooms = [];
    if (singleBed || superDeluxe || familyDeluxe) {
      rooms = data.map((roomData: ApiRoom) => ({
        id: roomData.roomTypeId,
        title: roomData.roomTypeName,
        images: [],
        ratings: roomData.rating,
        reviews: roomData.reviewCount,
        location: getRandomLocation(),
        roomSize: `${roomData.areaInSquareFeet || 0} sq ft`,
        beds: (roomData.singleBed || 0) + (roomData.doubleBed || 0),
        singleBed: roomData.singleBed,
        doubleBed: roomData.doubleBed,
        occupancy: roomData.maxCapacity || 0,
        deal: roomData.deal || "",
        price: roomData.price || 0,
      }));
    } else {
      const currentState = getState();
      const existingRooms = selectRooms(currentState);
      const newRooms = data.filter(
        (roomData: ApiRoom) =>
          !existingRooms.some((room) => room.id === roomData.roomTypeId)
      );
      rooms = [
        ...existingRooms,
        ...newRooms.map((roomData: ApiRoom) => ({
          id: roomData.roomTypeId,
          title: roomData.roomTypeName,
          images: [],
          ratings: roomData.rating,
          reviews: roomData.reviewCount,

          location: getRandomLocation(),
          roomSize: `${roomData.areaInSquareFeet || 0} sq ft`,
          beds: (roomData.singleBed || 0) + (roomData.doubleBed || 0),
          singleBed: roomData.singleBed,
          doubleBed: roomData.doubleBed,
          occupancy: roomData.maxCapacity || 0,
          deal: roomData.deal || "",
          price: roomData.price || 0,
        })),
      ];
    }
    rooms = rooms.filter((room) => room.price <= price);
    return rooms;
  }
);

export const fetchRoomPrices = createAsyncThunk("fetchRoomPrices", async () => {
  const response = await fetch(
    "https://team14-ibe-kdu24.azurewebsites.net/api/room-data"
    // "http://localhost:8081/api/room-data"
  );
  const data = await response.json();
  return data;
});

export interface Room {
  id: number;
  title: string;
  images: string[];
  ratings: number;
  reviews: number;
  location: string;
  roomSize: string;
  beds: number;
  singleBed: number;
  doubleBed: number;
  occupancy: number;
  deal: string;
  price: number;
  
}

interface RoomState {
  rooms: Room[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  activeState: number;
}

const initialState: RoomState = {
  rooms: [],
  status: "idle",
  error: null,
  activeState: 0,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    setActiveState: (state, action: PayloadAction<number>) => {
      state.activeState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An error occurred.";
      })
      .addCase(fetchRoomPrices.fulfilled, (state, action) => {
        const roomPrices = action.payload;
        state.rooms.forEach((room) => {
          room.price = roomPrices[room.title] || 0;
        });
      });
  },
});

export const { setRooms, setActiveState } = roomSlice.actions;
export const selectRooms = (state: RootState) => state.room.rooms;

export default roomSlice.reducer;
