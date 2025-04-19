import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerState {
  id?: string;
  // Add other fields as needed
}

const initialState: CustomerState = {};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action: PayloadAction<CustomerState>) => {
      return action.payload;
    },
    clearCustomer: () => {
      return initialState;
    },
    // Add other reducers as needed
  },
});

export const { setCustomer, clearCustomer } = customerSlice.actions;
export default customerSlice.reducer;
