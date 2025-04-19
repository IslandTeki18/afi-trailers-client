import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookingState {
  // Define your booking state interface here
  id?: string;
  // Add other fields as needed
}

const initialState: BookingState = {};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBooking: (state, action: PayloadAction<BookingState>) => {
      return action.payload;
    },
    clearBooking: () => {
      return initialState;
    },
    // Add other reducers as needed
  },
});

export const { setBooking, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
