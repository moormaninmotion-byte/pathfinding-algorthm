
import React from 'react';
import type { GridType } from '../types';
import Node from './Node';

interface GridProps {
  grid: GridType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

const Grid: React.FC<GridProps> = ({ grid, onMouseDown, onMouseEnter, onMouseUp }) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateRows: `repeat(${grid.length}, 1.5rem)`,
    gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 1.5rem)`,
  };

  return (
    <div className="grid-container border border-gray-600" style={gridStyle}>
      {grid.map((row, rowIdx) => (
        <React.Fragment key={rowIdx}>
          {row.map((node, nodeIdx) => (
            <div key={nodeIdx} className="w-6 h-6">
               <Node
                node={node}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseUp={onMouseUp}
              />
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Grid;