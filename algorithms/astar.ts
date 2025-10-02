
import type { Node, GridType } from '../types';

function manhattanDistance(nodeA: Node, nodeB: Node): number {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

export function astar(grid: GridType, startNode: Node, endNode: Node): { visitedNodesInOrder: Node[], nodesInShortestPathOrder: Node[] } {
  const visitedNodesInOrder: Node[] = [];
  const openSet: Node[] = [startNode];

  startNode.distance = 0; // g-score
  startNode.h = manhattanDistance(startNode, endNode);
  startNode.f = startNode.h;

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const currentNode = openSet.shift();
    
    if (!currentNode) break;

    if (currentNode.isWall) continue;

    // If we're trapped, stop.
    if (currentNode.distance === Infinity) {
      return { visitedNodesInOrder, nodesInShortestPathOrder: [] };
    }

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) {
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
      return { visitedNodesInOrder, nodesInShortestPathOrder };
    }

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isVisited) {
        continue;
      }

      const tentativeGScore = currentNode.distance + 1; // All edges have weight 1

      if (tentativeGScore < neighbor.distance) {
        neighbor.previousNode = currentNode;
        neighbor.distance = tentativeGScore; // g-score
        neighbor.h = manhattanDistance(neighbor, endNode);
        neighbor.f = neighbor.distance + neighbor.h;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
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
