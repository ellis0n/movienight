import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

interface RatingsTableProps {
  data: {
    tableData: any[];
    viewerId: string;
  };
}

const RatingsTable: React.FC<RatingsTableProps> = ({ data }) => {
  const { tableData, viewerId } = data;

  const columns: ColDef[] = useMemo(() => [
    {
      headerName: "Movie",
      field: "movieTitle",
      sortable: true,
      filter: true,
      cellRenderer: (params: { data: { movieId: any }; value: any }) => (
        <a href={`/movies/${params.data.movieId}`} className="text-blue-400 hover:underline">
          {params.value}
        </a>
      ),
    },
    {
      headerName: "Rating",
      field: "score",
      sortable: true,
      filter: true,
      cellRenderer: (params: { data: { id: any }; value: any }) => (
        <a href={`/viewers/${viewerId}/ratings/${params.data.id}`} className="text-blue-400 hover:underline">
          {params.value}
        </a>
      ),
    },
    {
      headerName: "Date",
      field: "date",
      sortable: true,
      filter: true,
      valueFormatter: (params: { value: string | number | Date }) => {
        if (params.value) {
          const date = params.value instanceof Date ? params.value : new Date(params.value);
          return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        }
        return 'N/A';
      },
    },
  ], [viewerId]);

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    minWidth: 100,
  };

  return (
    <div className="ag-theme-quartz-dark w-full h-full">
      <AgGridReact
        rowData={tableData}
        columnDefs={columns}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        enableCellTextSelection={true}
        suppressCopyRowsToClipboard={true}
      />
    </div>
  );
};

export default RatingsTable;
