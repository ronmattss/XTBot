const { SlashCommandBuilder, MessageEmbed } = require('discord.js');
const { readJSONFile, writeJSONFile } = require('../../helpers/jsonWriter');
const { TriggerARandomEvent, randomlySelectAParticipant, removeParticipantInGame, instantiateGame, possibleParticipants } = require('../../core/gameMaster');

function parseEvent(eventString) {
    if (eventString.includes("{Name}")) {
        const parsedEventString = eventString.replace(/{Name}/g, ()=> changeUserToMention());
        return parsedEventString;
    }
    return eventString;
}

function changeUserToMention() {
    let x = randomlySelectAParticipant();
    const mention = `<@${x.id}>`;
    return mention;
}



module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName("invoke-random-event")
        .setDescription('View saved events'),
    async execute(interaction) {
        const channelId = '400627470048428042'; // Replace with the ID of the channel you want to send the message to
        const channel = interaction.guild.channels.cache.get(channelId);
        await interaction.reply("Invoking a random Event (TEST DO NOT RESPOND)")
        await channel.send(parseEvent(TriggerARandomEvent()));        // 
        // removeParticipantInGame(user);
        // Corrected folder path for the JSON file

    },
};
