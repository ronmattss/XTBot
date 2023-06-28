class Game {
    // Game ID: random generated? "Match_{ID}"
    constructor(gameName,participants, gameLength) {
        this.gameName = gameName;
        this.participants = participants;
        this.gameLength = gameLength;
        this.isActive = false;
        
    }
     addEvent(event) {
        this.event = event;
    }

    //remove participant event
}

module.exports = Game;