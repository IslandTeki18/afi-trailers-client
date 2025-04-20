import * as React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

export const AppLayout = () => {
    const navigation = [
      { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
      { name: "Team", href: "#", icon: UsersIcon, current: false },
      {
        name: "Projects",
        href: "#",
        icon: FolderIcon,
        current: false,
        count: "3",
      },
      { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
      {
        name: "Documents",
        href: "#",
        icon: DocumentDuplicateIcon,
        current: false,
      },
      { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
    ];
    const teams = [
      { name: "Heroicons", href: "#", initial: "H", current: false },
      { name: "Tailwind Labs", href: "#", initial: "T", current: false },
      { name: "Workcation", href: "#", initial: "W", current: false },
    ];

    const links = [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ];
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar navigation={navigation} teams={teams} />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        <Header variant="primary" companyName="Afi Trailer Rentals" logo={} links={links} />
        <main className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
