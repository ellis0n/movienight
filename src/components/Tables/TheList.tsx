import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import ImageTooltip from './ImageTooltip';
import EditableRatingCell from './EditableRatingCell';
import '../../styles/ag-grid-custom.css';


const TheList = ({ tableData }: { tableData: any[] }) => {
  // Define helper function before using it
  const calculateAverageRating = (ratings: any[]) => {
    return ratings.length > 0
      ? (ratings.reduce((sum: number, r: { score: number }) => sum + r.score, 0) / ratings.length).toFixed(2)
      : 'N/A';
  };

  // Now we can use it in our state initialization
  const [rowData, setRowData] = useState<any[]>(tableData.map(movie => ({
    ...movie,
    averageRating: calculateAverageRating(movie.ratings)
  })));

  const handleRatingUpdate = (movieId: string, viewerName: string, newScore: number) => {
    setRowData(prevData => 
      prevData.map(movie => {
        if (movie.id === movieId) {
          const updatedRatings = movie.ratings.map((r: any) => 
            r.viewer.name === viewerName 
              ? { ...r, score: newScore }
              : r
          );
          return {
            ...movie,
            ratings: updatedRatings,
            averageRating: calculateAverageRating(updatedRatings)
          };
        }
        return movie;
      })
    );
  };

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
        const viewers = new Set(rowData.flatMap(movie => 
          movie.ratings.map(rating => rating.viewer.name)
        ));
        
        viewers.forEach(viewerName => {
          viewerColumns.push({
            headerName: viewerName,
            field: `ratings`,
            sortable: true,
            filter: false,
            minWidth: 100,
            cellClass: 'hover:bg-blue-500/10 transition-colors p-1 rounded',
            valueGetter: (params) => {
              const rating = params.data.ratings.find(r => r.viewer.name === viewerName);
              return rating ? rating.score : null;
            },
            cellRenderer: 'editableRatingCell',
            cellRendererParams: (params: any) => {
              const rating = params.data.ratings.find(r => r.viewer.name === viewerName);
              return {
                value: rating?.score,
                ratingId: rating?.id,
                viewerId: rating?.viewer?.id,
                isEditable: rating?.viewer?.isCurrentUser ?? false,
                onUpdate: (newScore: number) => {
                  handleRatingUpdate(params.data.id, viewerName, newScore);
                  params.api.refreshCells({ force: true });
                }
              };
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
    <div className="ag-theme-quartz-dark w-full h-full custom-grid">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        components={{
          editableRatingCell: EditableRatingCell
        }}
        domLayout="autoHeight"
        enableCellTextSelection={true}
      />
    </div>
  );
};

export { TheList };
