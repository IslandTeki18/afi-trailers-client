import * as React from "react";
import { useState } from "react";
import { TrailerDetailsDrawer } from "../components/TrailerDetailsDrawer";
import { Table } from "~src/shared/ui/Table";

// Sample trailer data
const sampleTrailers = [
  {
    id: "trailer-001",
    title: "Heavy Hauler 3000",
    status: "available",
    location: "Main Depot",
    type: "Flatbed",
  },
  {
    id: "trailer-002",
    title: "Transport Max",
    status: "in_use",
    location: "Site B",
    type: "Enclosed",
  },
  {
    id: "trailer-003",
    title: "Cargo Master",
    status: "maintenance",
    location: "Service Center",
    type: "Refrigerated",
  },
  {
    id: "trailer-004",
    title: "Load Runner",
    status: "available",
    location: "Main Depot",
    type: "Tanker",
  },
];

export const TrailersPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTrailerId, setSelectedTrailerId] = useState<
    string | undefined
  >(undefined);

  const handleTrailerClick = (trailerId: string) => {
    setSelectedTrailerId(trailerId);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const tableColumns = [
    { header: "Title", accessor: "title" },
    { header: "Type", accessor: "type" },
    { header: "Status", accessor: "status" },
    { header: "Location", accessor: "location" },
    { header: "Actions", accessor: "actions", isAction: true },
  ];

  // Process data to handle status display
  const tableData = sampleTrailers.map((trailer) => ({
    ...trailer,
    status: trailer.status.replace("_", " "),
    actions: "View Details", // This will be replaced by the action column
  }));

  const handleEditTrailer = (trailer: any) => {
    // Use the existing handler
    handleTrailerClick(trailer.id);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Trailers</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6 p-4">
            <Table
              title="Trailer Fleet"
              data={tableData}
              columns={tableColumns}
              addButtonText="Add New Trailer"
              onEditText="View Details"
              onEdit={handleEditTrailer}
              variant="transparent"
            />
          </div>
        </div>
      </main>

      <TrailerDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        trailerId={selectedTrailerId}
      />
    </div>
  );
};
