import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import EditableRatingCell from './Cells/EditableRatingCell';

interface MovieRatingsProps {
  data: {
    id: number;
    movieId: number;
    viewerId: number;
    score: number;
    viewerName: string;
  }[],
  viewerId: number | null;
  isAdmin: boolean;
}

const MovieRatings: React.FC<MovieRatingsProps> = ({ 
  data: initialData,
  isAdmin,
  viewerId     
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
      headerName: "Viewer",
      field: "viewerName",
      sortable: true,
      filter: false,
      cellRenderer: (params: { data: { viewerId: any }; value: any }) => (
        <>{params.value}</>
      ),
    },
    {
      headerName: "Rating",
      field: "score",
      sortable: true,
      filter: true,
      cellRenderer: (params: { data: {
        viewerId: number; id: number 
}; value: number }) => (
        <EditableRatingCell
          value={params.value}
          ratingId={params.data.id}
          isEditable={
            isAdmin ||
            params.data.viewerId === viewerId}
          onUpdate={(newValue) => handleRatingUpdate(params.data.id, newValue)}
        />
      ),
    },
  ], [isAdmin]);

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

export default MovieRatings;
