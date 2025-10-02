
export interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number; // For Dijkstra, g-score for A*
  previousNode: Node | null;
  // A* specific properties
  h: number; // Heuristic cost
  f: number; // Total cost (g + h)
}

export type GridType = Node[][];

export type Algorithm = 'dijkstra' | 'astar' | 'bfs';
