import * as React from "react";
import { Card, SectionWrapper } from "~src/shared/ui";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export const TrailerNotFound = () => {
  return (
    <SectionWrapper>
      <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mb-4" />
      <h2 className="text-2xl md:text-6xl font-bold mb-4">Trailer Not Found</h2>
      <p className="text-gray-600 mb-6">
        We're sorry, but the trailer you're looking for doesn't seem to be
        available. It may have been removed or the ID might be incorrect.
      </p>

      <p className="mt-6 text-sm text-gray-500">
        If you believe this is an error, please{" "}
        <Link to="/contact" className="text-yellow-600 hover:text-yellow-800">
          contact us
        </Link>
        .
      </p>
    </SectionWrapper>
  );
};
