const { SlashCommandBuilder, Collection } = require('discord.js');
const wordLeaderboard = require('./wordLeaderboard');

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
        await interaction.deferReply();
        const fetchedMessages = await fetchMessages(channel);
        await interaction.editReply("Waiting for messages");

        analyzeMessages(fetchedMessages);
        await wait(4_000);
        await interaction.followUp({ content: `Analyzed past messages for the word: "${wordLeaderboard.getWordToTrack()}" in channel ${channelId}`, ephemeral: true });
    },
};

async function fetchMessages(channel) {
    const fetchedMessages = new Collection();
    let lastId = null;
    const limit = 100;
    let totalFetched = 0;
    let whileLimit = 0;

    console.log("Fetching Messages");

    while (whileLimit < 100) {
        const options = { limit: Math.min(100 - totalFetched, limit) };
        if (lastId) {
            options.before = lastId;
        }

        const messages = await channel.messages.fetch(options);
        console.log(`${whileLimit} Fetched ${messages.size} messages`);

        if (messages.size === 0) {
            break;
        }

        messages.forEach(msg => fetchedMessages.set(msg.id, msg));
        whileLimit++;
        lastId = messages.last().id;
    }

    console.log(`Total fetched messages: ${fetchedMessages.size}`);
    return fetchedMessages;
}

function analyzeMessages(messages) {
    console.log("Analyzing Messages");
    messages.forEach(message => {
        if (message.author.bot) return;
        const content = message.content.toLowerCase();
        if (content.includes(wordLeaderboard.getWordToTrack().toLowerCase())) {
            wordLeaderboard.updateLeaderboard(message.author.id);
        }
    });
}
