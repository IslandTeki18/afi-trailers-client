import * as React from "react";
import { Button } from "~src/shared/ui/Button";

type Column = {
  header: string;
  accessor: string;
  isAction?: boolean;
};

type TableProps = {
  title?: string;
  description?: string;
  data: any[];
  columns: Column[];
  addButtonText?: string;
  onEdit?: (item: any) => void;
  variant?: "primary" | "secondary" | "accent" | "error" | "transparent";
};

export function Table({
  title,
  description,
  data,
  columns,
  onEdit,
  variant = "primary",
}: TableProps) {
  const variantClasses = {
    primary: {
      table: "divide-primary-200 bg-primary-500",
      header: "text-base-50",
      cell: "text-base-50",
    },
    secondary: {
      table: "divide-secondary-200 bg-secondary-500",
      header: "text-base-900",
      cell: "text-base-500",
    },
    accent: {
      table: "divide-accent-200 bg-accent-500",
      header: "text-base-900",
      cell: "text-base-500",
    },
    error: {
      table: "divide-gray-200",
      header: "text-gray-900",
      cell: "text-gray-500",
    },
    transparent: {
      table: "divide-base-100 bg-white",
      header: "text-base-900",
      cell: "text-base-500",
    },
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {(title || description) && (
        <div className="sm:flex sm:items-center">
          {(title || description) && (
            <div className="sm:flex-auto">
              {title && (
                <h1
                  className={`text-base font-semibold ${variantClasses[variant].header}`}
                >
                  {title}
                </h1>
              )}
              {description && (
                <p className={`mt-2 text-sm ${variantClasses[variant].cell}`}>
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table
              className={`min-w-full divide-y ${variantClasses[variant].table}`}
            >
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.header}
                      scope="col"
                      className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold ${
                        column.isAction ? "relative" : ""
                      } ${variantClasses[variant].header} ${
                        column.isAction ? "px-4" : ""
                      }`}
                    >
                      {column.isAction ? (
                        <span className="sr-only">{column.header}</span>
                      ) : (
                        column.header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${variantClasses[variant].table}`}>
                {data.map((item, index) => (
                  <tr key={item.id || index}>
                    {columns.map((column) => (
                      <td
                        key={column.accessor}
                        className={`whitespace-nowrap py-4 px-4 text-sm ${
                          column.isAction
                            ? "relative pl-3 pr-4 text-right font-medium"
                            : `${variantClasses[variant].cell}`
                        }`}
                      >
                        {column.isAction && onEdit ? (
                          <Button onClick={() => onEdit(item)} variant="link">
                            Edit
                            <span className="sr-only">
                              , {String(item[columns[index].accessor])}
                            </span>
                          </Button>
                        ) : (
                          String(item[column.accessor])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
