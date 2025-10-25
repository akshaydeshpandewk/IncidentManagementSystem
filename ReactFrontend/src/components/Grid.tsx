import React from 'react';
import type { GridRowData, GridColumn } from '../types/GridData';
import './Grid.css';

interface GridProps {
  data: GridRowData[];
  columns: GridColumn[];
}

const Grid: React.FC<GridProps> = ({ data, columns }) => {
  return (
    <div className="grid-container">
      <table className="grid-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                className="grid-header"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="grid-row">
              {columns.map((column) => (
                <td key={column.key} className="grid-cell">
                  {typeof row[column.key] === 'boolean' 
                    ? row[column.key] ? 'Yes' : 'No' 
                    : String(row[column.key])
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;