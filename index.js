// index.js
const fs = require('fs');
const readline = require('readline');
const Game = require('./Game');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const HISTORY_FILE = 'bowling_history.json';

const askQuestion = (question) => {
    return new Promise((resolve) => rl.question(question, resolve));
};

const setupGame = async () => {
    const numPlayers = parseInt(await askQuestion('Enter the number of players (1-6): '), 10);
    const playerNames = [];
    for (let i = 0; i < numPlayers; i++) {
        const name = await askQuestion(`Enter the name of player ${i + 1}: `);
        playerNames.push(name);
    }
    return new Game(playerNames);
};

const playGame = async (game) => {
    while (!game.isGameOver()) {
        const player = game.getCurrentPlayer();
        console.log(`\n${player.name}'s turn, Frame ${player.currentFrame + 1}`);
        
        const roll1 = parseInt(await askQuestion('Enter the number of pins knocked down on the first roll: '), 10);
        player.addRoll(roll1);

        const currentFrameIndex = player.currentFrame - 1;
        if (currentFrameIndex >= 0 && currentFrameIndex < 10) {
            const currentFrame = player.frames[currentFrameIndex];
            if (currentFrame && roll1 < 10 && currentFrame.length < 2) {
                const roll2 = parseInt(await askQuestion('Enter the number of pins knocked down on the second roll: '), 10);
                player.addRoll(roll2);
            }
        }

        game.nextPlayer();
    }
};

const saveHistory = (scores) => {
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
        history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    }
    history.push(scores);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
};

const displayHistory = () => {
    if (fs.existsSync(HISTORY_FILE)) {
        const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        console.log('\nGame History:');
        history.forEach((game, index) => {
            console.log(`\nGame ${index + 1}:`);
            game.forEach(player => {
                console.log(`${player.name}: ${player.score}`);
            });
        });
    } else {
        console.log('No game history found.');
    }
};

const displayResults = (game) => {
    console.log('\nFinal Scores:');
    game.printScores();

    const winners = game.getWinner();
    const winnerNames = winners.map(w => w.name);
    const winnerMessage = winners.length > 1 ? `It's a tie between: ${winnerNames.join(', ')}` : `The winner is: ${winnerNames[0]}`;

    console.log('\nFinal Scoreboard:');
    console.log('================');
    game.players.forEach(player => {
        console.log(`${player.name}: ${player.calculateScore()}`);
    });

    console.log(`\n${winnerMessage}`);

    // Save the final scores to history
    const finalScores = game.getFinalScores();
    saveHistory(finalScores);
};

const main = async () => {
    const action = await askQuestion('Choose an action: [1] New Game [2] Show History: ');
    if (action === '1') {
        const game = await setupGame();
        await playGame(game);
        displayResults(game);
    } else if (action === '2') {
        displayHistory();
    } else {
        console.log('Invalid action. Please choose 1 or 2.');
    }
    rl.close();
};

main();
