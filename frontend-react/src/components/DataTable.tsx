import React from 'react';
import type { ReactNode } from 'react';

interface DataTableProps {
  title: string;
  children: ReactNode;
  isEmpty: boolean;
  emptyMessage: string;
  status: string;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  children,
  isEmpty,
  emptyMessage,
  status
}) => {
  return (
    <div className="table-card">
      <div className="table-header">
        <h4>{title}</h4>
        <span className="table-status">{status}</span>
      </div>
      
      {isEmpty ? (
        <p className="table-empty">{emptyMessage}</p>
      ) : (
        <table>
          {children}
        </table>
      )}
    </div>
  );
};

export default DataTable;
