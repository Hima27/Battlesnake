const PathFinder = require("./pathFinder");
const BOARD_X = 11;
const BOARD_Y = 11;


function isSpaceValid(x, y, invalidSpaces) {
    return x >= 0 && x < BOARD_X && y >= 0 && y < BOARD_Y && !invalidSpaces.has(PathFinder.getIndex({x: x, y: y}));
}

function notImmediatelySuicidal(state, invalidSpaces) {
    const mySnakeHead = state.you.head;
    const headX = mySnakeHead.x;
    const headY = mySnakeHead.y;

    if (this.isSpaceValid(headX - 1, headY, invalidSpaces)) return "left";
    if (this.isSpaceValid(headX + 1, headY, invalidSpaces)) return "right";
    if (this.isSpaceValid(headX, headY - 1, invalidSpaces)) return "up";
    if (this.isSpaceValid(headX, headY + 1, invalidSpaces)) return "down";

    return "down";
}

function getBestFood(state, invalidSpaces) {
    const mySnake = state.you;
    let bestMove = null;

    for (const food of state.board.food) {
        const pathToFood = PathFinder.shortestPath(mySnake.head, food, state, invalidSpaces);

        if (!pathToFood) continue;

        if (bestMove !== null && myPath.length >= bestMove.length) continue;

        const enemyWillWin = state.board.snakes.some((snake) => {
            if (snake.id === mySnake.id) return false;
            const enemyPathToFood = PathFinder.shortestPath(snake.head, food, state, invalidSpaces);

            if (!enemyPathToFood) return false;

            if (enemyPathToFood.length === pathToFood.length) return mySnake.length < snake.length;

            return snake.length < pathToFood.length;
        });

        if (!enemyWillWin) bestMove = pathToFood;
    }

    return bestMove ? bestMove.direction : null;
}


function chaseTail(state, invalidSpaces) {
    const mySnakeHead = state.you.head;
    const mySnakeTail = state.you.body[state.you.body.length - 1];

    const pathToTail = PathFinder.shortestPath(mySnakeHead, mySnakeTail, state, invalidSpaces);

    return (pathToTail && pathToTail.length) ? pathToTail.direction : notImmediatelySuicidal(state, invalidSpaces);
}

module.exports = { chaseTail, getBestFood };

