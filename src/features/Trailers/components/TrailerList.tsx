import * as React from "react";
import { Table } from "~src/shared/ui/Table";
import { Trailer } from "../types/trailer.types";
import { formatCurrency } from "~src/shared/utils/formatCurrency";
import { formatTrailerStatus } from "../utils/formatTrailerStatus";

type TrailerListProps = {
  trailers: Trailer[];
  onEdit?: (trailer: Trailer) => void;
};

export const TrailerList = ({ trailers, onEdit }: TrailerListProps) => {
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Status", accessor: "status" },
    { header: "Rate", accessor: "rentalRate" },
    { header: "Weight Limit", accessor: "weightLimit" },
    { header: "Actions", accessor: "id", isAction: true },
  ];

  const formattedTrailers = trailers.map((trailer) => ({
    ...trailer,
    status: formatTrailerStatus(trailer.status),
    rentalRate: formatCurrency(trailer.rentalRate.amount),
    weightLimit: `${trailer.weight.maxLoad} lbs`,
  }));

  return (
    <Table
      title="Trailers"
      description="Manage and view all trailers currently in the system."
      data={formattedTrailers}
      columns={columns}
      onEdit={onEdit}
      variant="transparent"
      
    />
  );
};
