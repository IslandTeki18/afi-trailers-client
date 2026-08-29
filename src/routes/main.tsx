import * as React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Navbar, NavItem, SimpleFooter } from "~src/components";
import {
  HomeView,
  TrailerListView,
  TrailerBookingView,
  TrailerDetailsView,
  TrailerUsageView,
  AboutUsView,
  DropOffRentalContractView,
  DriveOffRentalContractView,
  ContactUsView,
  PricingView,
} from "~src/features";

const navigation: NavItem[] = [
  { name: "Trailers", href: "/trailers" },
  { name: "Pricing", href: "/pricing" },
  { name: "Etiquette", href: "/trailers/usage-guidelines" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-bone">
      <Navbar navigation={navigation} />
      <main className="flex flex-col">
        <Outlet />
      </main>
      <SimpleFooter />
      <ScrollRestoration />
    </div>
  );
}

export const mainRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { element: <HomeView />, index: true },
      {
        path: "trailers",
        children: [
          { element: <TrailerListView />, index: true },
          { path: ":trailerId", element: <TrailerDetailsView /> },
          { path: ":trailerId/book", element: <TrailerBookingView /> },
          { path: "usage-guidelines", element: <TrailerUsageView /> },
          {
            path: "rental-contract",
            children: [
              { path: "drop-off", element: <DropOffRentalContractView /> },
              { path: "drive-off", element: <DriveOffRentalContractView /> },
            ],
          },
        ],
      },
      { path: "about", element: <AboutUsView /> },
      { path: "contact", element: <ContactUsView /> },
      { path: "pricing", element: <PricingView /> },
    ],
  },
];
