import React from 'react';
import LoadingShimmer from './LoadingShimmer';
import EmptyState from './EmptyState';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export default function DataTable<T extends { uid?: string; id?: string }>({ 
  columns, 
  data, 
  loading = false, 
  emptyTitle = "No data found", 
  emptyMessage = "We couldn't find any records matching your criteria.", 
  onRowClick, 
  className = "" 
}: DataTableProps<T>) {
  if (loading) {
    return <LoadingShimmer variant="table" />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className={`overflow-x-auto rounded-xl ${className}`}>
      <table className="data-table">
        <thead>
          <tr className="bg-surface-low">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`text-[10px] uppercase tracking-wider font-bold text-on-surface-variant text-left ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-low/30">
          {data.map((item, rowIdx) => (
            <tr 
              key={item.uid || item.id || rowIdx} 
              onClick={() => onRowClick?.(item)}
              className={`${onRowClick ? "cursor-pointer hover:bg-surface-low transition-colors" : ""}`}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={`text-sm text-on-surface ${col.className || ""}`}>
                  {typeof col.accessor === "function" 
                    ? col.accessor(item) 
                    : (item[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
