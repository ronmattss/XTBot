const { SlashCommandBuilder } = require('discord.js');
const { readJSONFile, writeJSONFile } = require('../../helpers/jsonWriter');

function addEvent(events, eventType, event) {
    let eventCategory;

    switch (eventType) {
        case 1:
            eventCategory = 'GeneralEvents';
            break;
        case 2:
            eventCategory = 'CharacterEvents';
            break;
        case 3:
            eventCategory = 'KillEvents';
            break;
        case 4:
            eventCategory = 'PassiveEvents';
            break;
        default:
            console.error(`Invalid event type: ${eventType}`);
            return;
    }

    if (events.hasOwnProperty(eventCategory)) {
        events[eventCategory].push(event);
    } else {
        console.error(`Invalid event category: ${eventCategory}`);
        return;
    }

    writeJSONFile("../files/events", "events.json", events, true);
}

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName("add-new-event")
        .setDescription('Add an event for the game')
        .addIntegerOption(option =>
            option.setName('event-type')
                .setDescription("Set game events by number: 1 = General, 2 = Character, 3 = Kill, 4 = Passive")
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(4)
        )
        .addStringOption(option =>
            option.setName("create-event")
                .setDescription("Create an event, for tokens: use {Name} for names, list will be available soon"))
    ,
    async execute(interaction) {
        const eventType = interaction.options.getInteger('event-type');
        const event = interaction.options.getString('create-event');
        const channelId = '400627470048428042'; // Replace with the ID of the channel you want to send the message to
        const channel = interaction.guild.channels.cache.get(channelId);
        // Use the retrieved option value
        console.log('Event Type:', eventType);

        let events = readJSONFile("../files/events", "events.json");
        if (!events) {
            events = {
                GeneralEvents: [],
                CharacterEvents: [],
                PassiveEvents: [],
                KillEvents: []
            };
        }

        // Perform actions based on the event type
        switch (eventType) {
            case 1:
                // Handle General Events
                addEvent(events, eventType, event);

                await channel.send(interaction.user.username + ` Created a new General Event : ` + event);
                break;
            case 2:
                // Handle Character Events
                addEvent(events, eventType, event);

                await channel.send(interaction.user.username + ` Created a new Character Event : ` + event);
                break;
            case 3:
                // Handle Kill Events
                addEvent(events, eventType, event);

                await channel.send(interaction.user.username + ` Created a new Kill Event : ` + event);
                break;
            case 4:
                // Handle Passive Events
                addEvent(events, eventType, event);

                await channel.send(interaction.user.username + ` Created a new Passive Event : ` + event);
                break;
            default:
                // Invalid event type
                await channel.send(`Error, no event found`);
                break;
        }
    },
};