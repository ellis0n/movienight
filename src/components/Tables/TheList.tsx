import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import ImageTooltip from './ImageTooltip';

const TheList = ({ tableData }: { tableData: any[] }) => {
  
  const [rowData] = useState<any[]>(tableData.map(movie => ({
    ...movie,
    averageRating: movie.ratings.length > 0
      ? (movie.ratings.reduce((sum: any, r: { score: any; }) => sum + r.score, 0) / movie.ratings.length).toFixed(2)
      : 'N/A'
  })));
  // Column Definitions
  const colDefs: ColDef[] = [
    {
      headerName: 'Date',
      field: 'date',
      sortable: true,
      minWidth: 150, 
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('en-US');
      },
      tooltipValueGetter: (params) => `Watched on ${params.value}`,

    },
    {
      headerName: 'Title',
      field: 'title',
      sortable: true,
      filter: 'agTextColumnFilter',
    filterParams: {
      filterOptions: ['contains'],
      debounceMs: 200,
      caseSensitive: false,
    },
      minWidth: 200, // Set minimum width for title column
      cellRenderer: (params: { value: string; data: { id: any; }; }) => {
        const value = params.value ?? 'N/A';
        return value !== 'N/A' ? (
          <a href={`/movies/${params.data.id}`} className="text-blue-500 hover:underline">
            {value}
          </a>
        ) : (
          value
        );
      },
      tooltipComponent: ImageTooltip,
      tooltipField: 'title',
      tooltipValueGetter: (params) => {
        // Log the params to see what data is available
        return {
          title: params.data.title, // Use params.data to access the full row data
        };
      },
      tooltipComponentParams: (params: {
        data: any; value: any; 
}) => {
        return { title: params.data.title };
      }
    },
    {
      headerName: 'Average',
      field: 'averageRating',
      sortable: true,
      minWidth: 150, // Set minimum width for average rating column
    },
    ...useMemo(() => {
      const viewerColumns: ColDef[] = [];
      if (rowData.length > 0 && rowData[0].ratings) {
        const viewers = new Set(rowData.flatMap(movie => movie.ratings.map((rating: { viewer: { name: any; }; }) => rating.viewer.name)));
        viewers.forEach(viewerName => {
          viewerColumns.push({
            headerName: viewerName,
            field: `ratings`,
            sortable: true,
            filter: false,
            minWidth: 100,
            valueGetter: (params) => {
              const rating = params.data.ratings.find(r => r.viewer.name === viewerName);
              return rating ? rating.score : null;
            },
            cellRenderer: (params: { data: { ratings: any[]; }; }) => {
              const rating = params.data.ratings.find(r => r.viewer.name === viewerName);
              if (rating) {
                return (
                  <a 
                    href={`/viewers/${rating.viewer.id}/ratings/${rating.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {rating.score}
                  </a>
                );
              }
              return '-';
            }
          });
        });
      }
      return viewerColumns;
    }, [rowData])
  ];

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    minWidth: 10, 
  };

  return (
    <div className="ag-theme-quartz-dark w-full h-full">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight" 

      />
    </div>
  );
};

export { TheList };
