const { activeLobbies } = require('../socketEvents');

function generateGameId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let gameId = '';

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        gameId += characters.charAt(randomIndex);
    }

    if (activeLobbies.has(gameId)) {
        return generateGameId();
    }

    return gameId;
}

module.exports = {
    generateGameId
}