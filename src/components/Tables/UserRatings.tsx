import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import ImageTooltip from './ImageTooltip';

interface UserRatingsProps {
  data: Array<{
    id: string;
    movieId: string;
    score: number;
    date: string;
    movieTitle: string;
    viewerId: string;
  }>;
  viewerId: string;
}

const UserRatings: React.FC<UserRatingsProps> = ({ data, viewerId }) => {
  const columns: ColDef[] = useMemo(() => [
    {
      headerName: "Date",
      field: "date",
      sortable: true,
      filter: true,
      valueFormatter: (params: { value: string | number | Date }) => {
        if (params.value) {
          const date = params.value instanceof Date ? params.value : new Date(params.value);
          const year = date.getUTCFullYear();
          const month = String(date.getUTCMonth() + 1).padStart(2, '0');
          const day = String(date.getUTCDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        return 'N/A';
      },
    },
    {
      headerName: "Movie Title",
      field: "movieTitle",
      sortable: true,
      filter: true,
      cellRenderer: (params: { data: { movieId: string }; value: string }) => (
        <a href={`/movies/${params.data.movieId}`} className="text-blue-400 hover:underline">
          {params.value}
        </a>
      ),
      tooltipComponent: ImageTooltip,
      tooltipField: 'movieTitle',
      tooltipComponentParams: (params: { data: any; value: any }) => ({
        title: params.value,
      }),
    },
    {
      headerName: "Rating",
      field: "score",
      sortable: true,
      filter: true,
      cellRenderer: (params: { data: { id: string }; value: number }) => (
        <a href={`/viewers/${viewerId}/ratings/${params.data.id}`} className="text-blue-400 hover:underline">
          {params.value}
        </a>
      ),
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
        rowData={data}
        columnDefs={columns}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default UserRatings;
