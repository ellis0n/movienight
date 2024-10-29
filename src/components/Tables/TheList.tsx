import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import ImageTooltip from './ImageTooltip';
import EditableRatingCell from './EditableRatingCell';


const TheList = ({ tableData }: { tableData: any[] }) => {
  const calculateAverageRating = (ratings: any[]) => {
    return ratings.length > 0
      ? (ratings.reduce((sum: number, r: { score: number }) => sum + r.score, 0) / ratings.length).toFixed(2)
      : 'N/A';
  };

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
      minWidth: 200, 
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
        return {
          title: params.data.title,
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
      minWidth: 150, 
    },
    ...useMemo(() => {
      const viewerColumns: ColDef[] = [];
      if (rowData.length > 0 && rowData[0].ratings) {
        // Get all unique viewers
        const viewers = new Set(rowData.flatMap(movie => 
          movie.ratings.map((rating: { viewer: { name: any; isCurrentUser: boolean; }; }) => ({
            name: rating.viewer.name,
            isCurrentUser: rating.viewer.isCurrentUser
          }))
        ));

        // Convert to array and sort so current user is first
        const sortedViewers = Array.from(viewers)
          .filter((v, i, arr) => arr.findIndex(viewer => viewer.name === v.name) === i) // Remove duplicates
          .sort((a, b) => {
            if (a.isCurrentUser) return -1;
            if (b.isCurrentUser) return 1;
            return 0;
          });
        
        // Create columns in the sorted order
        sortedViewers.forEach(viewer => {
          viewerColumns.push({
            headerName: viewer.name,
            field: `ratings`,
            sortable: true,
            filter: false,
            minWidth: 100,
            cellClass: 'hover:bg-blue-500/10 transition-colors p-1 rounded',
            valueGetter: (params) => {
              const rating = params.data.ratings.find((r: { viewer: { name: string; }; }) => r.viewer.name === viewer.name);
              return rating ? rating.score : null;
            },
            cellRenderer: 'editableRatingCell',
            cellRendererParams: (params: any) => {
              const rating = params.data.ratings.find((r: { viewer: { name: string; }; }) => r.viewer.name === viewer.name);
              return {
                value: rating?.score,
                ratingId: rating?.id,
                viewerId: rating?.viewer?.id,
                isEditable: rating?.viewer?.isCurrentUser ?? false,
                onUpdate: (newScore: number) => {
                  handleRatingUpdate(params.data.id, viewer.name, newScore);
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
