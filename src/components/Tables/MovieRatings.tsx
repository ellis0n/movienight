import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

interface MovieRatingsProps {
  data: any[];
  movieId: string;
}

const MovieRatings: React.FC<MovieRatingsProps> = ({ data, movieId }) => {
  const columns: ColDef[] = useMemo(() => [
    {
      headerName: "Viewer",
      field: "viewerName",
      sortable: true,
      filter: true,
      cellRenderer: (params: { data: { viewerId: any }; value: any }) => (
        <a href={`/viewers/${params.data.viewerId}`} className="text-blue-400 hover:underline">
          {params.value}
        </a>
      ),
    },
    {
      headerName: "Rating",
      field: "score",
      sortable: true,
      filter: true,
      cellRenderer: (params: { data: { viewerId: any; id: any }; value: any }) => (
        <a href={`/viewers/${params.data.viewerId}/ratings/${params.data.id}`} className="text-blue-400 hover:underline">
          {params.value}
        </a>
      ),
    },
  ], [movieId]);

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
        suppressCopyRowsToClipboard={true}
      />
    </div>
  );
};

export default MovieRatings;
