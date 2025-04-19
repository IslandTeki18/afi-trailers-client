import * as React from "react";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { store } from "./store";
import { setTrailers } from "./slices/trailersSlice";
import { setCustomer } from "./slices/customerSlice";
import { setPricing } from "./slices/pricingSlice";

type ReduxProviderProps = {
  children: React.ReactNode;
};

export const ReduxProvider = (props: ReduxProviderProps) => {
  useEffect(() => {
    // Load trailers data from backend or local storage
    const fetchTrailers = async () => {
      try {
        const response = await fetch("/api/trailers");
        const data = await response.json();
        store.dispatch(setTrailers(data));
      } catch (error) {
        console.error("Failed to load trailers data:", error);
      }
    };

    // Load customer data from backend or local storage
    const fetchCustomer = async () => {
      try {
        const customerId = localStorage.getItem("customerId");
        const response = await fetch(`/api/customers/${customerId}`);
        const data = await response.json();
        store.dispatch(setCustomer(data));
      } catch (error) {
        console.error("Failed to load customer data:", error);
      }
    };

    fetchTrailers();
    fetchCustomer();
  }, []);

  return <Provider store={store}>{props.children}</Provider>;
};
