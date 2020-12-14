const Movement = require('../movement');
const PathFinder = require('../pathFinder');

    function move(gameState) {
        const invalidSpaces = PathFinder.findSpacesToAvoid(gameState);
        const directionOfFood = Movement.getBestFood(gameState, invalidSpaces);
        return directionOfFood ? directionOfFood : Movement.chaseTail(gameState, invalidSpaces);
    }

    module.exports(move);
