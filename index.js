const bodyParser = require("body-parser");
const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.get("/", handleIndex);
app.post("/start", handleStart);
app.post("/move", handleMove);
app.post("/end", handleEnd);

app.listen(PORT, () =>
  console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`)
);

function handleIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: "1",
    author: "Chabytes",
    color: "#736CCB",
    head: "shac-gamer",
    tail: "curled",
  };
  response.status(200).json(battlesnakeInfo);
}

function handleStart(request, response) {
  var gameData = request.body;

  console.log("START");
  response.status(200).send("ok");
}

function handleMove(request, response) {
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
      setToReturn.add(getIndex(coord));
    }

    for (const snake of state.board.snakes) {
      for (const coord of snake.body) {
        setToReturn.add(getIndex(coord));
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
        if (
          curr[curr.length - 1].x == goal.x &&
          curr[curr.length - 1].y == goal.y
        )
          return {
            direction: determineDirection(curr[0], curr[1]),
            length: level,
          };

        if (
          !spacesToAvoid.has({ x: curr.x + 1, y: curr.y }) &&
          isSpaceWithinBoard({ x: curr.x + 1, y: curr.y }) &&
          !visited.has(getIndex({ x: curr.x + 1, y: curr.y }))
        ) {
          visited.add({ x: curr.x + 1, y: curr.y });
          q.push([...q].concat({ x: curr.x + 1, y: curr.y }));
        }

        if (
          !spacesToAvoid.has({ x: curr.x - 1, y: curr.y }) &&
          isSpaceWithinBoard({ x: curr.x - 1, y: curr.y }) &&
          !visited.has(getIndex({ x: curr.x - 1, y: curr.y }))
        ) {
          visited.add({ x: curr.x - 1, y: curr.y });
          q.push([...q].concat({ x: curr.x - 1, y: curr.y }));
        }

        if (
          !spacesToAvoid.has({ x: curr.x, y: curr.y + 1 }) &&
          isSpaceWithinBoard({ x: curr.x, y: curr.y + 1 }) &&
          !visited.has(getIndex({ x: curr.x, y: curr.y + 1 }))
        ) {
          visited.add({ x: curr.x, y: curr.y + 1 });
          q.push([...q].concat({ x: curr.x, y: curr.y + 1 }));
        }

        if (
          !spacesToAvoid.has({ x: curr.x, y: curr.y - 1 }) &&
          isSpaceWithinBoard({ x: curr.x, y: curr.y - 1 }) &&
          !visited.has(getIndex({ x: curr.x, y: curr.y - 1 }))
        ) {
          visited.add({ x: curr.x, y: curr.y - 1 });
          q.push([...q].concat({ x: curr.x, y: curr.y - 1 }));
        }
        size--;
      }
      level++;
    }
    return null;
  }

  function getBestFood(state, invalidSpaces) {
    const mySnake = state.you;
    let bestMove = null;

    for (const food of state.board.food) {
      const pathToFood = shortestPath(mySnake.head, food, state, invalidSpaces);

      if (!pathToFood) continue;

      if (bestMove !== null && myPath.length >= bestMove.length) continue;

      const enemyWillWin = state.board.snakes.some((snake) => {
        if (snake.id === mySnake.id) return false;
        const enemyPathToFood = shortestPath(
          snake.head,
          food,
          state,
          invalidSpaces
        );

        if (!enemyPathToFood) return false;

        if (enemyPathToFood.length === pathToFood.length)
          return mySnake.length < snake.length;

        return snake.length < pathToFood.length;
      });

      if (!enemyWillWin) bestMove = pathToFood;
    }

    return bestMove ? bestMove.direction : null;
  }

  function chaseTail(state, invalidSpaces) {
    const mySnakeHead = state.you.head;
    const mySnakeTail = state.you.body[state.you.body.length - 1];

    const pathToTail = shortestPath(
      mySnakeHead,
      mySnakeTail,
      state,
      invalidSpaces
    );

    return pathToTail && pathToTail.length
      ? pathToTail.direction
      : notImmediatelySuicidal(state, invalidSpaces);
  }
  function move(gameState) {
    const invalidSpaces = findSpacesToAvoid(gameState);
    const directionOfFood = getBestFood(gameState, invalidSpaces);
    return directionOfFood
      ? directionOfFood
      : chaseTail(gameState, invalidSpaces);
  }

  const direction = move(request.body);
    console.log("direction: " + direction);

  const nextDirection = move(request.body);
  console.log("direction: " + nextDirection);

  response.status(200).send({
    move: nextDirection,
  });
}

function handleEnd(request, response) {
  var gameData = request.body;

  console.log("END");
  response.status(200).send("ok");
}
