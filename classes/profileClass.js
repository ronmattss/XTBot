class Profile {
    constructor(name, playstyle) {
        this.name = name;
        this.playstyle = playstyle;
        this.health = 100; // Default health value
        this.status = 'Alive'; // Default status
        this.events = []; // Array to store events
    }
    addEvent(event)
    {
        this.events.push(event);
    }
    toJson()
    {
        return JSON.stringify(this);
    }
}
