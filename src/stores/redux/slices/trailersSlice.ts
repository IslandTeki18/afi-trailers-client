import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Trailer {
  id: string;
  // Add other trailer properties
}

const initialState: Trailer[] = [];

export const trailersSlice = createSlice({
  name: "trailers",
  initialState,
  reducers: {
    setTrailers: (state, action: PayloadAction<Trailer[]>) => {
      return action.payload;
    },
    // Add other reducers as needed
  },
});

export const { setTrailers } = trailersSlice.actions;
export default trailersSlice.reducer;
