import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

interface MoviesProps {
  data: {
    id: number;
    title: string;
    date: string;
    viewers?: { id: number; name: string }[];
  }[];
}

const MoviesTable: React.FC<MoviesProps> = ({ data }) => {
  const columns: ColDef[] = useMemo(() => {
    const baseColumns: ColDef[] = [
      {
        headerName: "Date",
        field: "date",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Title",
        field: "title",
        sortable: true,
        filter: true,
        cellRenderer: (params: { data: { id: any }; value: any }) => (
          <a href={`/movies/${params.data.id}`} className="text-blue-400 hover:underline">
            {params.value}
          </a>
        ),
      },
      {
        headerName: "Average Rating",
        field: "average",
        sortable: true,
        filter: true,
      },
    ];

    // Add viewer columns if available
    if (data[0]?.viewers) {
      data[0].viewers.forEach(viewer => {
        baseColumns.push({
          headerName: viewer.name,
          field: `ratings.${viewer.id}`,
          sortable: true,
          filter: true,
          cellRenderer: (params: { value: any }) => params.value || '-',
        });
      });
    }

    return baseColumns;
  }, [data]);

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    minWidth: 100,
  };
  
  const gridOptions = {
    tooltipInteraction: true,
}

  return (
    <div className="ag-theme-quartz-dark w-full h-full">
      <AgGridReact
        rowData={data}
        columnDefs={columns}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        enableCellTextSelection={true}
        gridOptions={gridOptions}
      />
    </div>
  );
};

export default MoviesTable;
