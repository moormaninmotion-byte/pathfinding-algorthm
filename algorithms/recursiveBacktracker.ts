import type { Node, GridType } from '../types';

/**
 * Generates a maze using the Recursive Backtracker algorithm (a randomized DFS).
 * It starts with a grid full of walls and carves paths.
 * @param grid The grid to generate the maze on.
 * @param startNode The starting node for the maze generation.
 * @returns An array of nodes representing the walls that have been carved into paths, in order.
 */
export function recursiveBacktracker(grid: GridType, startNode: Node): Node[] {
    const wallsToAnimate: Node[] = [];
    const stack: Node[] = [];
    
    // The grid is already full of walls, so we just need to track visited cells for carving.
    const visited: boolean[][] = Array(grid.length).fill(false).map(() => Array(grid[0].length).fill(false));

    stack.push(startNode);
    visited[startNode.row][startNode.col] = true;

    while (stack.length > 0) {
        const currentNode = stack.pop()!;
        const neighbors = getUnvisitedNeighbors(currentNode, grid, visited);

        if (neighbors.length > 0) {
            stack.push(currentNode);

            // Choose a random neighbor
            const { nextNode, wallBetween } = neighbors[Math.floor(Math.random() * neighbors.length)];
            
            // Mark the wall and the next node as visited
            visited[wallBetween.row][wallBetween.col] = true;
            visited[nextNode.row][nextNode.col] = true;

            // Animate the carving of the wall and the path to the next node
            wallsToAnimate.push(wallBetween);
            wallsToAnimate.push(nextNode);
            
            stack.push(nextNode);
        }
    }
    return wallsToAnimate;
}

/**
 * Gets the unvisited neighbors of a node for maze generation.
 * A "neighbor" is two cells away, and we also care about the wall between them.
 */
function getUnvisitedNeighbors(node: Node, grid: GridType, visited: boolean[][]): {nextNode: Node, wallBetween: Node}[] {
    const neighbors: {nextNode: Node, wallBetween: Node}[] = [];
    const { row, col } = node;

    // Directions: [row_offset, col_offset, wall_row_offset, wall_col_offset]
    const directions = [
        [-2, 0, -1, 0], // North
        [0, 2, 0, 1],   // East
        [2, 0, 1, 0],   // South
        [0, -2, 0, -1],  // West
    ];

    for (const [dr, dc, dwr, dwc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        // Check if the new cell is within bounds
        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
            // Check if the new cell has not been visited
             if (!visited[newRow][newCol]) {
                neighbors.push({
                    nextNode: grid[newRow][newCol],
                    wallBetween: grid[row + dwr][col + dwc]
                });
            }
        }
    }

    return neighbors;
}
