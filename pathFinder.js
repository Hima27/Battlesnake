function getIndex(coord) {
    return 11 * coord.y + coord.x;
}

function isSpaceWithinBoard(coord) {
    return coord.x >= 0 && coord.x < 11 && coord.y >= 0 && coord.y < 11;
}

function determineDirection(start, end) {
    if (start.x < end.x) return "up";
    if (start.x > end.x) return "down";
    if (start.y < end.y) return "right";
    return "left";
}

function findSpacesToAvoid(state) {
    const setToReturn = new Set();
    for (const coord of state.board.hazards) {
        spacesToAvoid.add(getIndex(coord));
    }

    for (const snake of state.board.snakes) {
        for (const coord of snake.body) {
            spacesToAvoid.add(getIndex(coord));
        }
    }
    return setToReturn;
}

function shortestPath(start, goal, spacesToAvoid) {
    const visited = new Set();
    const q = [];
    const spacesToAvoid = findSpacesToAvoid();

    let level = 1;
    q.push([start]);
    visited.add(getIndex(start));

    while (!q.length > 0) {
        let size = q.length;
        while (size > 0) {
            const curr = q.shift();
            if (curr[curr.length - 1].x == goal.x && curr[curr.length - 1].y == goal.y) 
                return {direction: determineDirection(curr[0], curr[1]), length: level}

            if (!spacesToAvoid.has({x: curr.x + 1, y: curr.y}) && isSpaceWithinBoard({x: curr.x + 1, y: curr.y}) && !visited.has(getIndex({x: curr.x + 1, y: curr.y}))) {
                visited.add({x: curr.x + 1, y: curr.y});
                q.push([...q].concat({x: curr.x + 1, y: curr.y}));
            }

            if (!spacesToAvoid.has({x: curr.x - 1, y: curr.y}) && isSpaceWithinBoard({x: curr.x - 1, y: curr.y}) && !visited.has(getIndex({x: curr.x - 1, y: curr.y}))) {
                visited.add({x: curr.x - 1, y: curr.y});
                q.push([...q].concat({x: curr.x - 1, y: curr.y}));
            }

            if (!spacesToAvoid.has({x: curr.x, y: curr.y + 1}) && isSpaceWithinBoard({x: curr.x, y: curr.y + 1}) && !visited.has(getIndex({x: curr.x, y: curr.y + 1}))) {
                visited.add({x: curr.x, y: curr.y + 1});
                q.push([...q].concat({x: curr.x, y: curr.y + 1}));
            }

            if (!spacesToAvoid.has({x: curr.x, y: curr.y - 1}) && isSpaceWithinBoard({x: curr.x, y: curr.y - 1}) && !visited.has(getIndex({x: curr.x, y: curr.y - 1}))) {
                visited.add({x: curr.x, y: curr.y - 1});
                q.push([...q].concat({x: curr.x, y: curr.y - 1}));
            }
            size--;
        }
        level++;
    }
    return null;
}

module.exports = { shortestPath, findSpacesToAvoid, getIndex }