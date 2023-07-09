const { SlashCommandBuilder, MessageEmbed } = require('discord.js');
const { readJSONFile, writeJSONFile } = require('../../helpers/jsonWriter');
const { TriggerARandomEvent,randomlySelectAParticipant, removeParticipantInGame, instantiateGame, possibleParticipants } = require('../../core/gameMaster');


module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName("view-events")
        .setDescription('View saved events'),
    async execute(interaction) {
        const channelId = '400627470048428042'; // Replace with the ID of the channel you want to send the message to
        const channel = interaction.guild.channels.cache.get(channelId);

        // Corrected folder path for the JSON file
        let events = readJSONFile("../files/events", "events.json");

        if (!events) {
            // Handle error when JSON file is not found
            console.error('Error reading JSON file.');
            return;
        }
        const formatEvents = (eventsArray) => {
            return eventsArray.join('\n >');
          };
      
          const generalEvents = formatEvents(events.GeneralEvents);
          const characterEvents = formatEvents(events.CharacterEvents);
          const passiveEvents = formatEvents(events.PassiveEvents);
          const killEvents = formatEvents(events.KillEvents);
      
          const message = `
      **Event Data**
      Here are the event details:
      
      **General Events:**
 >${generalEvents}
      
      **Character Events:**
 >${characterEvents}
      
      **Passive Events:**
 >${passiveEvents}
      
      **Kill Events:**
 >${killEvents}
          `;

        channel.send(message);
    },
};
