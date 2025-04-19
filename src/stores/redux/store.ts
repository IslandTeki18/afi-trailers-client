import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./slices/bookingSlice";
import customerReducer from "./slices/customerSlice";
import pricingReducer from "./slices/pricingSlice";
import trailersReducer from "./slices/trailersSlice";

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    customer: customerReducer,
    pricing: pricingReducer,
    trailers: trailersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
