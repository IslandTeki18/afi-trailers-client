import * as React from "react";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { trailersAtom } from "../atoms/trailersAtom";
import { customerAtom } from "../atoms/customerAtom";
import { pricingAtom } from "../atoms/pricingAtom";
import { useEffect } from "react";

type RecoilInitializerProps = {
  children: React.ReactNode;
};

export const RecoilInitializer = (props: RecoilInitializerProps) => {
  const setTrailers = useSetRecoilState(trailersAtom);
  const setCustomer = useSetRecoilState(customerAtom);
  const setPricing = useSetRecoilState(pricingAtom);

  useEffect(() => {
    // Load trailers data from backend or local storage
    const fetchTrailers = async () => {
      try {
        const response = await fetch("/api/trailers");
        const data = await response.json();
        setTrailers(data); // Initialize trailersAtom with fetched data
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
        setCustomer(data); // Initialize customerAtom with fetched data
      } catch (error) {
        console.error("Failed to load customer data:", error);
      }
    };

    // Set initial pricing information
    const initializePricing = () => {
      const baseRate = 100; // Example: setting a default base rate
      const durationDiscount = 0; // Example: default no discount
      setPricing({
        baseRate,
        durationDiscount,
        total: baseRate - durationDiscount,
      });
    };

    fetchTrailers();
    fetchCustomer();
    initializePricing();
  }, [setTrailers, setCustomer, setPricing]);

  return <RecoilRoot>{props.children}</RecoilRoot>;
};
