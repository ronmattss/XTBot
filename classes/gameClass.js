class Game {
    // Game ID: random generated? "Match_{ID}"
    constructor(participants, gameLength) {
        this.participants = participants;
        this.gameLength = gameLength;
    }
    addEvent(event) {
        this.event = event;
    }
}