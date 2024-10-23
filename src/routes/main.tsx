import * as React from "react";
import { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Footer, Navbar, SimpleFooter } from "~src/components";
import {
  HomeView,
  TrailerListView,
  TrailerBookingView,
  TrailerDetailsView,
  TrailerUsageView,
  ConfirmationView,
  AboutUsView,
  DropOffRentalContractView,
  DriveOffRentalContractView,
  ContactUsView,
  PricingView,
} from "~src/features";

function NonAuthenticatedRoutes() {
  const [navigation, setNavigation] = React.useState([
    { name: "Home", href: "/", current: true },
    { name: "Trailers", href: "/trailers", current: false },
    { name: "Pricing", href: "/pricing", current: false },
    { name: "About", href: "/about", current: false },
    { name: "Contact", href: "/contact", current: false },
  ]);
  const updatedNavItems = useMemo(() => {
    return navigation.map((item) => ({
      ...item,
      current: item.href === location.pathname,
    }));
  }, [location.pathname, navigation]);

  useEffect(() => {
    setNavigation(updatedNavItems);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar navigation={navigation} />
      <Outlet />
      <SimpleFooter />
    </div>
  );
}

export const mainRoutes = [
  {
    path: "/",
    element: <NonAuthenticatedRoutes />,
    children: [
      {
        element: <HomeView />,
        index: true,
      },
      {
        path: "trailers",
        children: [
          {
            element: <TrailerListView />,
            index: true,
          },
          {
            path: ":trailerId",
            element: <TrailerDetailsView />,
          },
          // {
          //   path: ":trailerId/book",
          //   element: <TrailerBookingView />,
          // },
          // {
          //   path: ":trailerId/confirmation/:confirmationId",
          //   element: <ConfirmationView />,
          // },
          {
            path: "usage-guidelines",
            element: <TrailerUsageView />,
          },
          {
            path: "rental-contract",
            children: [
              {
                path: "drop-off",
                element: <DropOffRentalContractView />,
              },
              {
                path: "drive-off",
                element: <DriveOffRentalContractView />,
              },
            ],
          },
        ],
      },
      {
        path: "about",
        element: <AboutUsView />,
      },
      {
        path: "contact",
        element: <ContactUsView />,
      },
      {
        path: "pricing",
        element: <PricingView />,
      },
    ],
  },
];
