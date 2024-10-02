import * as React from "react";
import { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "~src/components";
import { HomeView } from "~src/features";
// Import views here

function NonAuthenticatedRoutes() {
  const [navigation, setNavigation] = React.useState([
    { name: "Home", href: "/", current: true },
    { name: "Trailers", href: "/trailers", current: false },
    { name: "Pricing", href: "/pricing", current: false },
    { name: "About", href: "/about", current: false },
    { name: "Login", href: "/sign-in", current: false },
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
    <div className="flex flex-col h-screen">
      <Navbar navigation={navigation} />
      <Outlet />
      <Footer
        variant="primary"
        companyName="Your Company"
        logo="path/to/logo.png"
        description="Your company description"
      />
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
    ],
  },
];
