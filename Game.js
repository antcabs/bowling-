// Game.js
const Player = require('./Player');

class Game {
    constructor(playerNames) {
        this.players = playerNames.map(name => new Player(name));
        this.currentPlayerIndex = 0;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    isGameOver() {
        return this.players.every(player => player.currentFrame >= 10);
    }

    printScores() {
        this.players.forEach(player => {
            console.log(`${player.name}: ${player.calculateScore()}`);
        });
    }

    getFinalScores() {
        return this.players.map(player => ({
            name: player.name,
            score: player.calculateScore()
        }));
    }

    getWinner() {
        let maxScore = Math.max(...this.players.map(player => player.calculateScore()));
        return this.players.filter(player => player.calculateScore() === maxScore);
    }
}

module.exports = Game;

