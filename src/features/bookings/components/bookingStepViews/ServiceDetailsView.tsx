import * as React from "react";
import { useState } from "react";
import { Input, Button } from "~src/components";

type ServiceDetailsViewProps = {
  serviceType: "FULL" | "SELF";
  handleServiceDetails: (data: any) => void;
};

export const ServiceDetailsView = (props: ServiceDetailsViewProps) => {
  const [fullServiceDetails, setFullServiceDetails] = useState({
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    contact: {
      name: "",
      phone: "",
      email: "",
    },
  });
  const [selfServiceDetails, setSelfServiceDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });

  function handleServiceDetails() {
    if (props.serviceType === "FULL") {
      props.handleServiceDetails(fullServiceDetails);
      setFullServiceDetails({
        address: {
          street: "",
          city: "",
          state: "",
          zip: "",
        },
        contact: {
          name: "",
          phone: "",
          email: "",
        },
      });
    } else {
      props.handleServiceDetails(selfServiceDetails);
      setSelfServiceDetails({
        name: "",
        phone: "",
        email: "",
      });
    }
  }

  function renderServiceDetails(serviceType: "FULL" | "SELF") {
    switch (serviceType) {
      case "FULL":
        return (
          <div>
            <h2 className="text-2xl">Full Service Details</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              quam velit, vulputate eu pharetra nec, mattis ac neque.
            </p>
          </div>
        );
      case "SELF":
        return (
          <div>
            <h2 className="text-2xl">Self Service Details</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              quam velit, vulputate eu pharetra nec, mattis ac neque.
            </p>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {renderServiceDetails(props.serviceType)}
    </div>
  );
};
