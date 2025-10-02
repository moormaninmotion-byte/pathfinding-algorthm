
import type { Node, GridType } from '../types';

export function bfs(grid: GridType, startNode: Node, endNode: Node): { visitedNodesInOrder: Node[], nodesInShortestPathOrder: Node[] } {
  const visitedNodesInOrder: Node[] = [];
  const queue: Node[] = [];

  startNode.isVisited = true;
  queue.push(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (!currentNode) continue;

    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) {
        return { visitedNodesInOrder, nodesInShortestPathOrder: getNodesInShortestPathOrder(endNode) };
    }

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isWall && !neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
  }

  return { visitedNodesInOrder, nodesInShortestPathOrder: [] };
}

function getNeighbors(node: Node, grid: GridType): Node[] {
  const neighbors: Node[] = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

function getNodesInShortestPathOrder(endNode: Node): Node[] {
  const nodesInShortestPathOrder: Node[] = [];
  let currentNode: Node | null = endNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
