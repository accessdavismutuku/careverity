import type { ReactNode } from "react";

interface DataTableColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  ariaLabel?: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  minWidth?: string;
}

export function DataTable<T>({ ariaLabel, columns, rows, getRowKey, minWidth = "760px" }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table aria-label={ariaLabel} className="w-full text-left text-sm" style={{ minWidth }}>
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            {columns.map((column) => (
              <th className="px-3 py-3" key={column.header} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-lqcs-line">
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => (
                <td className={column.className ?? "px-3 py-3"} key={column.header}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
