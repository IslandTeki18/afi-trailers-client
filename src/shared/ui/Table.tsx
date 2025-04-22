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
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  variant?: "primary" | "secondary" | "accent" | "error" | "transparent";
};

export function Table({
  title,
  description,
  data,
  columns,
  addButtonText,
  onAdd,
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
      {(title || description || addButtonText) && (
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
          {addButtonText && onAdd && (
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Button
                variant="primary"
                onClick={onAdd}
              >
                {addButtonText}
              </Button>
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
                  {columns.map((column, index) => (
                    <th
                      key={column.header}
                      scope="col"
                      className={`py-3.5 ${
                        index === 0 ? "pl-4 pr-3 sm:pl-0" : "px-3"
                      } text-left text-sm font-semibold ${
                        column.isAction ? "relative" : ""
                      } ${variantClasses[variant].header}`}
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
                {data.map((item, rowIndex) => (
                  <tr key={item.id || rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td
                        key={column.accessor}
                        className={`whitespace-nowrap ${
                          colIndex === 0
                            ? "py-4 pl-4 pr-3 font-medium sm:pl-0"
                            : "px-3 py-4"
                        } text-sm ${
                          column.isAction
                            ? "relative pl-3 pr-4 text-right font-medium sm:pr-0"
                            : `${variantClasses[variant].cell}`
                        }`}
                      >
                        {column.isAction && onEdit ? (
                          <Button
                            onClick={() => onEdit(item)}
                            variant="link"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                            <span className="sr-only">
                              , {String(item[columns[0].accessor])}
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
