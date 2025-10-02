import React, { useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_GRID_ROWS, 
  INITIAL_GRID_COLS, 
  INITIAL_START_NODE_ROW, 
  INITIAL_START_NODE_COL, 
  INITIAL_END_NODE_ROW, 
  INITIAL_END_NODE_COL 
} from './constants';
import type { Node, GridType, Algorithm } from './types';
import Grid from './components/Grid';
import Controls from './components/Controls';
import { dijkstra } from './algorithms/dijkstra';
import { astar } from './algorithms/astar';
import { bfs } from './algorithms/bfs';
import { recursiveBacktracker } from './algorithms/recursiveBacktracker';

const createNode = (
  row: number, 
  col: number,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): Node => {
  return {
    row,
    col,
    isStart: row === startRow && col === startCol,
    isEnd: row === endRow && col === endCol,
    isWall: false,
    isVisited: false,
    isPath: false,
    distance: Infinity,
    previousNode: null,
    h: 0,
    f: 0,
  };
};

const createInitialGrid = (
  rows: number, 
  cols: number, 
  startRow: number, 
  startCol: number, 
  endRow: number, 
  endCol: number
): GridType => {
  const grid: GridType = [];
  for (let row = 0; row < rows; row++) {
    const currentRow: Node[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(row, col, startRow, startCol, endRow, endCol));
    }
    grid.push(currentRow);
  }
  return grid;
};

const getNewGridWithWallToggled = (grid: GridType, row: number, col: number): GridType => {
  const newGrid = grid.map(r => r.slice());
  const node = newGrid[row][col];
  if (node.isStart || node.isEnd) return newGrid;
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const App: React.FC = () => {
  const [grid, setGrid] = useState<GridType>([]);
  const [rows, setRows] = useState(INITIAL_GRID_ROWS);
  const [cols, setCols] = useState(INITIAL_GRID_COLS);
  const [startNodeRow, setStartNodeRow] = useState(INITIAL_START_NODE_ROW);
  const [startNodeCol, setStartNodeCol] = useState(INITIAL_START_NODE_COL);
  const [endNodeRow, setEndNodeRow] = useState(INITIAL_END_NODE_ROW);
  const [endNodeCol, setEndNodeCol] = useState(INITIAL_END_NODE_COL);
  
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isGeneratingMaze, setIsGeneratingMaze] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('dijkstra');
  const [animationSpeed, setAnimationSpeed] = useState(10); // Lower is faster
  
  // State for step-by-step visualization
  const [algorithmResult, setAlgorithmResult] = useState<{ visitedNodesInOrder: Node[], nodesInShortestPathOrder: Node[] } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const isBusy = isVisualizing || isGeneratingMaze;
  const isSteppingActive = algorithmResult !== null;
  const isSteppingComplete = isSteppingActive && currentStep >= algorithmResult.visitedNodesInOrder.length + algorithmResult.nodesInShortestPathOrder.length;

  const resetSteppingState = () => {
    setAlgorithmResult(null);
    setCurrentStep(0);
  };
  
  useEffect(() => {
    resetSteppingState();
    const newGrid = createInitialGrid(rows, cols, startNodeRow, startNodeCol, endNodeRow, endNodeCol);
    setGrid(newGrid);
  }, [rows, cols, startNodeRow, startNodeCol, endNodeRow, endNodeCol]);

  const handleMouseDown = (row: number, col: number) => {
    if (isBusy) return;
    resetSteppingState();
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setIsMousePressed(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed || isBusy) return;
    resetSteppingState();
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  const clearGrid = useCallback(() => {
    if (isBusy) return;
    resetSteppingState();
    const newGrid = createInitialGrid(rows, cols, startNodeRow, startNodeCol, endNodeRow, endNodeCol);
    setGrid(newGrid);
  }, [isBusy, rows, cols, startNodeRow, startNodeCol, endNodeRow, endNodeCol]);

  const clearPath = useCallback(() => {
    if (isBusy) return;
    resetSteppingState();
    const newGrid = grid.map(row => 
      row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null,
        h: 0,
        f: 0,
      }))
    );
    setGrid(newGrid);
  }, [grid, isBusy]);

  const handleAlgorithmChange = (algo: Algorithm) => {
    resetSteppingState();
    setSelectedAlgorithm(algo);
  };

  const handleGridResize = (newRows: number, newCols: number) => {
    if (isBusy) return;
    resetSteppingState();
    newRows = Math.max(10, Math.min(50, newRows));
    newCols = Math.max(10, Math.min(100, newCols));

    const newStartRow = Math.floor(newRows / 2);
    const newStartCol = Math.floor(newCols / 4);
    const newEndRow = Math.floor(newRows / 2);
    const newEndCol = Math.floor(newCols * 3 / 4);

    setRows(newRows);
    setCols(newCols);
    setStartNodeRow(newStartRow);
    setStartNodeCol(newStartCol);
    setEndNodeRow(newEndRow);
    setEndNodeCol(newEndCol);
  };

  const animateSearch = (visitedNodesInOrder: Node[], nodesInShortestPathOrder: Node[]) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, animationSpeed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(r => r.slice());
            const gridNode = newGrid[node.row][node.col];
            if (!gridNode.isStart && !gridNode.isEnd) {
                 newGrid[node.row][node.col] = { ...gridNode, isVisited: true };
            }
            return newGrid;
        });
      }, animationSpeed * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder: Node[]) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(r => r.slice());
            const gridNode = newGrid[node.row][node.col];
            if (!gridNode.isStart && !gridNode.isEnd) {
                newGrid[node.row][node.col] = { ...gridNode, isPath: true };
            }
            return newGrid;
        });
      }, (animationSpeed * 3) * i);
    }
    setTimeout(() => setIsVisualizing(false), (animationSpeed * 3) * nodesInShortestPathOrder.length);
  };

  const visualizeAlgorithm = () => {
    if (isBusy || !grid.length) return;
    resetSteppingState();
    setIsVisualizing(true);
    clearPath();
    
    setTimeout(() => {
        const freshGrid = grid.map(row => row.map(node => ({...node})));
        const startNode = freshGrid[startNodeRow][startNodeCol];
        const endNode = freshGrid[endNodeRow][endNodeCol];
        let result;

        switch (selectedAlgorithm) {
          case 'dijkstra': result = dijkstra(freshGrid, startNode, endNode); break;
          case 'bfs': result = bfs(freshGrid, startNode, endNode); break;
          case 'astar': result = astar(freshGrid, startNode, endNode); break;
          default: setIsVisualizing(false); return;
        }
        const { visitedNodesInOrder, nodesInShortestPathOrder } = result;
        animateSearch(visitedNodesInOrder, nodesInShortestPathOrder);
    }, 50);
  };

  const handleStep = () => {
    if (isBusy || isSteppingComplete) return;

    if (!isSteppingActive) {
      clearPath();
      setTimeout(() => {
        const freshGrid = grid.map(row => row.map(node => ({ ...node })));
        const startNode = freshGrid[startNodeRow][startNodeCol];
        const endNode = freshGrid[endNodeRow][endNodeCol];
        let result;

        switch (selectedAlgorithm) {
          case 'dijkstra': result = dijkstra(freshGrid, startNode, endNode); break;
          case 'bfs': result = bfs(freshGrid, startNode, endNode); break;
          case 'astar': result = astar(freshGrid, startNode, endNode); break;
          default: return;
        }

        if (result.visitedNodesInOrder.length > 0) {
            setAlgorithmResult(result);
            setCurrentStep(1);
            const firstNode = result.visitedNodesInOrder[0];
            setGrid(prevGrid => {
                const newGrid = prevGrid.map(r => r.slice());
                if (!newGrid[firstNode.row][firstNode.col].isStart) {
                     newGrid[firstNode.row][firstNode.col].isVisited = true;
                }
                return newGrid;
            });
        }
      }, 50);
      return;
    }

    const { visitedNodesInOrder, nodesInShortestPathOrder } = algorithmResult;

    if (currentStep < visitedNodesInOrder.length) {
      const node = visitedNodesInOrder[currentStep];
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(r => r.slice());
        if (!newGrid[node.row][node.col].isStart && !newGrid[node.row][node.col].isEnd) {
            newGrid[node.row][node.col].isVisited = true;
        }
        return newGrid;
      });
      setCurrentStep(currentStep + 1);
    } else {
      const pathStepIndex = currentStep - visitedNodesInOrder.length;
      if (pathStepIndex < nodesInShortestPathOrder.length) {
        const node = nodesInShortestPathOrder[pathStepIndex];
        setGrid(prevGrid => {
          const newGrid = prevGrid.map(r => r.slice());
          if (!newGrid[node.row][node.col].isStart && !newGrid[node.row][node.col].isEnd) {
              newGrid[node.row][node.col].isPath = true;
          }
          return newGrid;
        });
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const animateMazeGeneration = (wallsToAnimate: Node[]) => {
    for (let i = 0; i < wallsToAnimate.length; i++) {
      setTimeout(() => {
        const node = wallsToAnimate[i];
        setGrid(prevGrid => {
          const newGrid = prevGrid.map(r => r.slice());
          newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isWall: false };
          return newGrid;
        });
      }, animationSpeed * i);
    }
    setTimeout(() => setIsGeneratingMaze(false), animationSpeed * wallsToAnimate.length);
  };

  const handleGenerateMaze = () => {
    if (isBusy) return;
    resetSteppingState();
    setIsGeneratingMaze(true);
    clearGrid();

    setTimeout(() => {
      const newGrid = grid.map(row =>
        row.map(node => ({ ...node, isWall: !(node.isStart || node.isEnd) }))
      );
      setGrid(newGrid);

      const startNode = newGrid[startNodeRow][startNodeCol];
      const wallsToAnimate = recursiveBacktracker(newGrid, startNode);
      animateMazeGeneration(wallsToAnimate);
    }, 50);
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen">
      <Controls
        isVisualizing={isVisualizing}
        isGeneratingMaze={isGeneratingMaze}
        onVisualize={visualizeAlgorithm}
        onGenerateMaze={handleGenerateMaze}
        onClearGrid={clearGrid}
        onClearPath={clearPath}
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={handleAlgorithmChange}
        animationSpeed={animationSpeed}
        onAnimationSpeedChange={setAnimationSpeed}
        rows={rows}
        cols={cols}
        onGridResize={handleGridResize}
        isSteppingActive={isSteppingActive}
        isSteppingComplete={isSteppingComplete}
        onStep={handleStep}
      />
      <Grid
        grid={grid}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default App;