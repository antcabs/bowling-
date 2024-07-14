// Player.js
class Player {
    constructor(name) {
        this.name = name;
        this.frames = Array.from({ length: 10 }, () => []);
        this.currentFrame = 0;
    }

    addRoll(pins) {
        if (this.currentFrame >= 10) return;
        this.frames[this.currentFrame].push(pins);
        if (this.frames[this.currentFrame].length === 2 || pins === 10) {
            this.currentFrame++;
        }
    }

    calculateScore() {
        let score = 0;
        for (let i = 0; i < 10; i++) {
            const frame = this.frames[i];
            if (this.isStrike(frame)) {
                score += 10 + this.strikeBonus(i);
            } else if (this.isSpare(frame)) {
                score += 10 + this.spareBonus(i);
            } else {
                score += frame.reduce((a, b) => a + b, 0);
            }
        }
        return score;
    }

    isStrike(frame) {
        return frame[0] === 10;
    }

    isSpare(frame) {
        return frame[0] + frame[1] === 10;
    }

    strikeBonus(frameIndex) {
        const nextFrame = this.frames[frameIndex + 1] || [];
        const nextNextFrame = this.frames[frameIndex + 2] || [];
        if (nextFrame[0] === 10) {
            return 10 + (nextNextFrame[0] || 0);
        } else {
            return nextFrame[0] + (nextFrame[1] || 0);
        }
    }

    spareBonus(frameIndex) {
        const nextFrame = this.frames[frameIndex + 1] || [];
        return nextFrame[0] || 0;
    }
}

module.exports = Player;

