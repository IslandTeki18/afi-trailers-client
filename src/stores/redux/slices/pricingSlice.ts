import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PricingState {
  baseRate: number;
  durationDiscount: number;
  total: number;
}

const initialState: PricingState = {
  baseRate: 0,
  durationDiscount: 0,
  total: 0,
};

export const pricingSlice = createSlice({
  name: "pricing",
  initialState,
  reducers: {
    setPricing: (state, action: PayloadAction<PricingState>) => {
      return action.payload;
    },
    // Add other reducers as needed
  },
});

export const { setPricing } = pricingSlice.actions;
export default pricingSlice.reducer;
