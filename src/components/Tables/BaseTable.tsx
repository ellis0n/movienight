import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

interface BaseTableProps {
  data: any[];
  columnDefs: ColDef[];
  defaultColDef?: ColDef;
  domLayout?: 'normal' | 'autoHeight' | 'print';
  className?: string;
  gridOptions?: GridOptions;
  components?: { [key: string]: any };
  onCellValueChanged?: (event: any) => void;
  isEditable?: boolean;
}

const BaseTable = ({
  data,
  columnDefs,
  defaultColDef = {
    flex: 1,
    resizable: true,
    minWidth: 100,
  },
  domLayout = 'autoHeight',
  className = 'w-full h-full',
  gridOptions,
  components,
  onCellValueChanged,
  isEditable = false,
}: BaseTableProps) => {
  const enhancedDefaultColDef = {
    ...defaultColDef,
    editable: isEditable,
  };

  return (
    <div className={`ag-theme-quartz-dark ${className}`}>
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={enhancedDefaultColDef}
        domLayout={domLayout}
        enableCellTextSelection={true}
        suppressCopyRowsToClipboard={true}
        gridOptions={gridOptions}
        components={components}
        onCellValueChanged={onCellValueChanged}
      />
    </div>
  );
};

export default BaseTable; 