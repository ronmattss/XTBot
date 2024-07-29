const { SlashCommandBuilder } = require('discord.js');
const { Collection } = require('discord.js');
const wordLeaderboard = require('../../wordLeaderboard');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('analyzehistory')
        .setDescription('Analyze past messages for the tracked word in a specific channel')
        .addStringOption(option =>
            option.setName('channelid')
                .setDescription('The ID of the channel to analyze')
                .setRequired(true)),
    async execute(interaction) {
        const channelId = interaction.options.getString('channelid');
        const channel = interaction.guild.channels.cache.get(channelId);
        if (!channel) {
            await interaction.reply({ content: `Channel with ID ${channelId} not found.`, ephemeral: true });
            return;
        }

        const fetchedMessages = await fetchMessages(channel);
        analyzeMessages(fetchedMessages);
        await interaction.reply({ content: `Analyzed past messages for the word: "${wordLeaderboard.getWordToTrack()}" in channel ${channelId}`, ephemeral: true });
    },
};

async function fetchMessages(channel) {
    const fetchedMessages = new Collection();
    let lastId = null;
    const limit = 100;

    while (true) {
        const options = { limit };
        if (lastId) {
            options.before = lastId;
        }

        const messages = await channel.messages.fetch(options);
        if (messages.size === 0) {
            break;
        }

        fetchedMessages.concat(messages);
        lastId = messages.last().id;
    }

    return fetchedMessages;
}

function analyzeMessages(messages) {
    messages.forEach(message => {
        if (message.author.bot) return;
        const content = message.content.toLowerCase();
        if (content.includes(wordLeaderboard.getWordToTrack().toLowerCase())) {
            wordLeaderboard.updateLeaderboard(message.author.id);
        }
    });
}
