import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const fetchCustomerBookingHistory = createAsyncThunk(
  "customer/fetchBookingHistory",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const customerId = state.customer.id;

    if (!customerId) {
      throw new Error("No customer ID available");
    }

    const response = await fetch(`/api/bookings?customerId=${customerId}`);
    return response.json();
  }
);
