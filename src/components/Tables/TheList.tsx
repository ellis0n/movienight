import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ITooltipParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import ImageTooltip from './ImageTooltip';
import EditableRatingCell from './Cells/EditableRatingCell';
import AddRatingCell from './Cells/AddRatingCell';

interface TheListProps {
  tableData: any[];
  isAdmin: boolean;
}

const TheList = ({ tableData, isAdmin }: TheListProps) => {
  const [isHeatmapEnabled, setIsHeatmapEnabled] = useState(false);
  const [isStarRatingEnabled, setIsStarRatingEnabled] = useState(false);

const getHeatmapColor = (score: number) => {
  if (score === null || score === undefined) return 'transparent';
  
  const numScore = Number(score);
  if (isNaN(numScore)) {
    return 'transparent';
  }
  
  // More distinct ranges with proper color assignments
  if (numScore === 10) return 'rgba(234, 179, 8, 0.2)';     // Gold
  if (numScore >= 8) return 'rgba(34, 197, 94, 0.2)';       // Green
  if (numScore >= 7) return 'rgba(132, 204, 22, 0.2)';      // Light Green
  if (numScore >= 5) return 'rgba(250, 204, 21, 0.2)';      // Yellow
  if (numScore >= 3) return 'rgba(249, 115, 22, 0.2)';      // Orange
  return 'rgba(239, 68, 68, 0.2)';                          // Red
};

  const calculateAverageRating = (ratings: any[]) => {
    return ratings.length > 0
      ? (ratings.reduce((sum: number, r: { score: number }) => sum + r.score, 0) / ratings.length).toFixed(2)
      : 'N/A';
  };

  const [rowData, setRowData] = useState<any[]>(tableData.map(movie => ({
    ...movie,
    averageRating: calculateAverageRating(movie.ratings)
  })));

  const handleRatingUpdate = (movieId: string, viewerName: string, newScore: number, ratingId?: number) => {
    setRowData(prevData => 
      prevData.map(movie => {
        if (movie.id === movieId) {
          let updatedRatings;
          const viewer = movie.viewers.find((v: any) => v.name === viewerName);
          const existingRating = movie.ratings.find((r: any) => r.viewer.name === viewerName);
          
          if (!existingRating) {
            // Add new rating
            updatedRatings = [...movie.ratings, {
              id: ratingId,
              score: newScore,
              viewer: {
                name: viewerName,
                id: viewer.id
              }
            }];
          } else {
            // Update existing rating
            updatedRatings = movie.ratings.map((r: any) => 
              r.viewer.name === viewerName 
                ? { ...r, score: newScore }
                : r
            );
          }

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

  const getStarRating = (score: number) => {
    if (!score && score !== 0) return '';
    
    const starScore = score / 2;
    const fullStars = Math.floor(starScore);
    const hasHalfStar = starScore - fullStars >= 0.5;
    
    return (
      <div className="star-rating">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">★</span>
        ))}
        {hasHalfStar && (
          <span className="star half">★</span>
        )}
      </div>
    );
  };

  const colDefs: ColDef[] = [
    {
      headerName: 'Date',
      field: 'date',
      sortable: true,
      minWidth: 90, 
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
      cellRenderer: (params: { value: string; data: { id: string; pickedBy: string; }; }) => {
        const value = params.value ?? 'N/A';
        const picker = rowData[0]?.viewers?.find((v: { id: string; }) => v.id === params.data.pickedBy);
        
        return value !== 'N/A' ? (
          <a 
            href={`/movies/${params.data.id}`}
            className="text-blue-500 hover:underline"
            style={{ 
              borderLeft: picker ? `2px solid ${picker.color}40` : 'none',
              paddingLeft: picker ? '0.5rem' : '0'
            }}
          >
            {value}
          </a>
        ) : (
          value
        );
      },
      tooltipComponent: ImageTooltip,
      tooltipField: 'title',
      tooltipComponentParams: (params: { data: any; }) => ({
        data: params.data
      }),
    },
    {
      headerName: 'Avg',
      field: 'averageRating',
      sortable: true,
      minWidth: 65,
      cellClass: (params) => {
        const value = params.value !== 'N/A' ? Number(params.value) : null;
        return ['transition-colors', getHeatmapColor(value)];
      },
      cellRenderer: (params) => {
        return params.value === 'N/A' ? params.value : Number(params.value).toFixed(2);
      }
    },
    ...useMemo(() => {
      const viewerColumns: ColDef[] = [];
      if (rowData.length > 0 && rowData[0].viewers) {
        const sortedViewers = rowData[0].viewers
          .sort((a: { isCurrentUser: any; id: number; }, b: { isCurrentUser: any; id: number; }) => {
            if (a.isCurrentUser) return -1;
            if (b.isCurrentUser) return 1;
            return a.id - b.id;
          });
        
        sortedViewers.forEach((viewer: { name: string; id: number; color: string; isCurrentUser: boolean; }) => {
          viewerColumns.push({
            headerName: viewer.name,
            field: 'ratings',
            sortable: true,
            minWidth: 100,
            headerClass: 'py-2',
            headerComponentParams: {
              template: `<div style="color: ${viewer.color}">${viewer.name}</div>`
            },
            valueGetter: (params) => {
              const rating = params.data.ratings.find((r: any) => 
                r.viewer.id === viewer.id
              );
              return rating ? rating.score : undefined;
            },
            cellStyle: (params) => ({
              borderLeft: `2px solid ${viewer.color}40`,
              backgroundColor: params.value ? `${viewer.color}10` : 'transparent',
              transition: 'background-color 0.2s ease'
            }),
            cellRenderer: (params: { data: { id: string; ratings: any[]; }; }) => {
              const rating = params.data.ratings.find((r: { viewer: { id: number; }; score: number }) => {
                return r.viewer.id === viewer.id && r.score != null;
              });

              console.log(rating);
              
              return (
                <div className="flex items-center gap-2">
                  {isStarRatingEnabled ? (
                    <div className="flex items-center justify-center w-full">
                      {rating ? getStarRating(rating.score) : '-'}
                    </div>
                  ) : (
                    <EditableRatingCell
                      value={rating ? rating.score : null}
                      ratingId={rating?.id}
                      isEditable={(viewer.isCurrentUser || isAdmin)}
                      onUpdate={(newValue, newRatingId) => handleRatingUpdate(params.data.id, viewer.name, newValue, newRatingId)}
                      movieId={Number(params.data.id)}
                      viewerId={viewer.id}
                    />
                  )}
                </div>
              );
            }
          });
        });
      }
      return viewerColumns;
    }, [rowData, isAdmin, isHeatmapEnabled, isStarRatingEnabled])
  ];

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    minWidth: 10, 
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-4 flex justify-end gap-2 px-4">
        {/* <button
          onClick={() => setIsHeatmapEnabled(!isHeatmapEnabled)}
          className={`px-4 py-2 rounded-md transition-colors ${
            isHeatmapEnabled 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-700 hover:bg-gray-600'
          } text-white`}
        >
          {isHeatmapEnabled ? 'Show User Colors' : 'Show Heatmap'}
        </button> */}
        <button
          onClick={() => setIsStarRatingEnabled(!isStarRatingEnabled)}
          className={`px-4 py-2 rounded-md transition-colors  ${
            isStarRatingEnabled 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-700 hover:bg-gray-600'
          } text-white`}
        >
          {isStarRatingEnabled ? 'Show Decimal' : 'Show Stars'}
        </button>
      </div>
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
    </div>
  );
};

export { TheList };
