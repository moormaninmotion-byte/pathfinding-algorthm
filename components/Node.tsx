
import React from 'react';
import type { Node as NodeType } from '../types';

interface NodeProps {
  node: NodeType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

const Node: React.FC<NodeProps> = ({ node, onMouseDown, onMouseEnter, onMouseUp }) => {
  const { row, col, isStart, isEnd, isWall, isVisited, isPath } = node;

  const extraClassName = isEnd
    ? 'bg-red-500 node-end'
    : isStart
    ? 'bg-green-500 node-start'
    : isPath
    ? 'bg-yellow-400 node-path'
    : isVisited
    ? 'bg-blue-400 node-visited'
    : isWall
    ? 'bg-gray-700 node-wall'
    : 'bg-gray-800 hover:bg-gray-700';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`w-full h-full border border-gray-600 transition-colors duration-300 ease-in-out ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
};

export default Node;
