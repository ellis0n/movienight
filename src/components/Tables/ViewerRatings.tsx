import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import ImageTooltip from './ImageTooltip';
import EditableRatingCell from './EditableRatingCell';
import type { Rating, Viewer } from '../../types/viewers';

interface ViewerRatingsProps {
  data: Rating[];
  isCurrentViewer: boolean;
  isAdmin?: boolean;
}

const ViewerRatings: React.FC<ViewerRatingsProps> = ({ 
  data: initialData, 
  isCurrentViewer,
  isAdmin
}) => {
  const [data, setData] = useState(initialData);

  const handleRatingUpdate = (ratingId: number, newScore: number) => {
    setData(prevData => 
      prevData.map(rating => 
        rating.id === ratingId 
          ? { ...rating, score: newScore }
          : rating
      )
    );
  };

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
      cellRenderer: (params: { data: { movieId: number }; value: string }) => (
        <>
          {/* <a href={`/movies/${params.data.movieId}`} className="text-blue-400 hover:underline"> */}
            {params.value}
          {/* </a> */}
        </>
      ),
      tooltipComponent: ImageTooltip,
      tooltipField: 'movieTitle',
    },
    {
      headerName: "Rating",
      field: "score",
      sortable: true,
      filter: true,
      cellRenderer: (params: { data: { id: number }; value: number }) => (
        <EditableRatingCell
          value={params.value}
          ratingId={params.data.id}
          isEditable={isCurrentViewer || isAdmin || false}
          onUpdate={(newValue) => handleRatingUpdate(params.data.id, newValue)}
        />
      ),
    },
  ], [isCurrentViewer, isAdmin]);

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
        components={{
          editableRatingCell: EditableRatingCell
        }}
      />
    </div>
  );
};

export default ViewerRatings;
