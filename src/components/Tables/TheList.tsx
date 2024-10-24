import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

// Define the Viewer and Movie interfaces
interface Viewer {
  id: number;
  name: string;
}

interface Rating {
  viewerId: number;
  score: number;
}

interface Movie {
  id: string;
  title: string;
  date: string;
  averageRating: string; // Updated to string for formatted display
  [key: string]: any; // Allow dynamic viewer fields
}

// Define the props interface
interface TheListProps {
  movieList: Movie[];
  viewers: Viewer[];
}

const TheList: React.FC<TheListProps> = ({ movieList = [], viewers = [] }) => {
  const [rowData] = useState<Movie[]>(movieList);

  // Check for undefined or empty viewers array before generating columns
  const viewerColumns: ColDef[] = useMemo(() => {
    return (viewers || []).map((viewer) => ({
      headerName: viewer.name,
      field: `viewer_${viewer.id}`, // Match the viewer score field
      sortable: true,
      filter: true,
      minWidth: 150, // Set minimum width for viewer columns
      cellRenderer: (params) => {
        const value = params.value ?? 'N/A';
        return value !== 'N/A' ? (
          <a href={`/viewers/${viewer.id}/movies/${params.data.id}`} className="text-blue-500 hover:underline">
            {value}
          </a>
        ) : (
          value
        );
      },
    }));
  }, [viewers]);

  // Column Definitions
  const colDefs: ColDef[] = [
    {
      headerName: 'Date',
      field: 'date',
      sortable: true,
      filter: true,
      minWidth: 150, 
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-US');
      },
    },
    {
      headerName: 'Title',
      field: 'title',
      sortable: true,
      filter: true,
      minWidth: 200, // Set minimum width for title column
      cellRenderer: (params) => {
        const value = params.value ?? 'N/A';
        return value !== 'N/A' ? (
          <a href={`/movies/${params.data.id}`} className="text-blue-500 hover:underline">
            {value}
          </a>
        ) : (
          value
        );
      },
    },
    {
      headerName: 'Average',
      field: 'averageRating',
      sortable: true,
      filter: true,
      minWidth: 150, // Set minimum width for average rating column
    },
    ...viewerColumns, // Add the dynamic viewer columns here
  ];

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    minWidth: 100, // Set a default minimum width for all columns
  };

  return (
    <div className="ag-theme-quartz-dark w-full h-full">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight" // Adjust the table height automatically
      />
    </div>
  );
};

export default TheList;