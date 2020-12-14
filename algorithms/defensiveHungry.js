const Movement = require('../movement');
const PathFinder = require('../pathFinder');

    export function move(gameState) {
        const invalidSpaces = PathFinder.findSpacesToAvoid(gameState);
        const directionOfFood = Movement.getBestFood(gameState, invalidSpaces);
        return directionOfFood ? directionOfFood : Movement.chaseTail(gameState, invalidSpaces);
    }
