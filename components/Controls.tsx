import React, { useState, useEffect } from 'react';
import type { Algorithm } from '../types';

interface ControlsProps {
  isVisualizing: boolean;
  isGeneratingMaze: boolean;
  selectedAlgorithm: Algorithm;
  animationSpeed: number;
  rows: number;
  cols: number;
  isSteppingActive: boolean;
  isSteppingComplete: boolean;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onVisualize: () => void;
  onStep: () => void;
  onGenerateMaze: () => void;
  onClearGrid: () => void;
  onClearPath: () => void;
  onAnimationSpeedChange: (speed: number) => void;
  onGridResize: (rows: number, cols: number) => void;
}

const LegendItem: React.FC<{ color: string; text: string }> = ({ color, text }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-5 h-5 ${color} border border-gray-400`}></div>
    <span className="text-sm">{text}</span>
  </div>
);

const Controls: React.FC<ControlsProps> = ({ 
  isVisualizing, 
  isGeneratingMaze,
  selectedAlgorithm,
  animationSpeed,
  rows,
  cols,
  isSteppingActive,
  isSteppingComplete,
  onAlgorithmChange,
  onVisualize, 
  onStep,
  onGenerateMaze,
  onClearGrid, 
  onClearPath,
  onAnimationSpeedChange,
  onGridResize,
}) => {
  const [inputRows, setInputRows] = useState(rows);
  const [inputCols, setInputCols] = useState(cols);

  useEffect(() => {
    setInputRows(rows);
    setInputCols(cols);
  }, [rows, cols]);

  const getVisualizeButtonText = () => {
    switch(selectedAlgorithm) {
      case 'dijkstra': return "Visualize Dijkstra's";
      case 'astar': return "Visualize A*";
      case 'bfs': return "Visualize BFS";
      default: return "Visualize";
    }
  };

  const handleResize = () => {
    const r = parseInt(inputRows.toString(), 10);
    const c = parseInt(inputCols.toString(), 10);
    if (!isNaN(r) && !isNaN(c) && r > 0 && c > 0) {
      onGridResize(r, c);
    }
  };

  const isBusy = isVisualizing || isGeneratingMaze;
  const disablePrimaryActions = isBusy || isSteppingActive;
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4 w-full max-w-7xl">
      <div className="flex flex-col gap-4">
        {/* Top Row: Title and Main Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-cyan-400">Pathfinding Visualizer</h1>
          <div className="flex items-center flex-wrap gap-2">
            <div className="relative">
              <select
                id="algorithm-select"
                value={selectedAlgorithm}
                onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
                disabled={disablePrimaryActions}
                className="appearance-none bg-gray-700 border border-gray-600 text-white font-semibold py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-gray-600 focus:border-gray-500 disabled:opacity-50"
                aria-label="Select Algorithm"
              >
                <option value="dijkstra">Dijkstra</option>
                <option value="astar">A* Search</option>
                <option value="bfs">Breadth-First Search</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            <button
              onClick={onVisualize}
              disabled={disablePrimaryActions}
              className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isVisualizing ? 'Visualizing...' : getVisualizeButtonText()}
            </button>
            <button
              onClick={onStep}
              disabled={isBusy || isSteppingComplete}
              className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              Step
            </button>
            <button
              onClick={onGenerateMaze}
              disabled={disablePrimaryActions}
              className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 disabled:bg-gray-500 transition-colors"
            >
              {isGeneratingMaze ? 'Generating...' : 'Generate Maze'}
            </button>
            <button
              onClick={onClearGrid}
              disabled={isBusy}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 disabled:bg-gray-500 transition-colors"
            >
              Clear Grid
            </button>
            <button
              onClick={onClearPath}
              disabled={isBusy}
              className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 disabled:bg-gray-500 transition-colors"
            >
              Clear Path
            </button>
          </div>
        </div>
        
        {/* Second Row: Settings (Speed, Resize) */}
        <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-4">
          <div className="flex items-center gap-3">
            <label htmlFor="speed-slider" className="text-sm font-medium">Speed</label>
            <input
              id="speed-slider"
              type="range"
              min="5"
              max="100"
              value={105 - animationSpeed}
              onChange={(e) => onAnimationSpeedChange(105 - parseInt(e.target.value, 10))}
              disabled={disablePrimaryActions}
              className="w-32"
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="rows-input" className="text-sm font-medium">Rows</label>
            <input
              id="rows-input"
              type="number"
              value={inputRows}
              onChange={(e) => setInputRows(parseInt(e.target.value, 10))}
              disabled={disablePrimaryActions}
              className="w-20 bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-center"
            />
            <label htmlFor="cols-input" className="text-sm font-medium">Cols</label>
            <input
              id="cols-input"
              type="number"
              value={inputCols}
              onChange={(e) => setInputCols(parseInt(e.target.value, 10))}
              disabled={disablePrimaryActions}
              className="w-20 bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-center"
            />
            <button
              onClick={handleResize}
              disabled={disablePrimaryActions}
              className="px-4 py-1 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 disabled:bg-gray-500 transition-colors"
            >
              Resize Grid
            </button>
          </div>
        </div>
        
        {/* Third Row: Legend and Instructions */}
        <div className="mt-2">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-300">
                <LegendItem color="bg-green-500" text="Start Node" />
                <LegendItem color="bg-red-500" text="End Node" />
                <LegendItem color="bg-gray-700" text="Wall" />
                <LegendItem color="bg-blue-400" text="Visited Node" />
                <LegendItem color="bg-yellow-400" text="Path Node" />
            </div>
            <p className="mt-3 text-sm text-gray-400">
                Click "Generate Maze" or click and drag on the grid to create walls, then visualize an algorithm!
            </p>
        </div>
      </div>
    </div>
  );
};

export default Controls;