const { SlashCommandBuilder, Collection } = require('discord.js');
const wordLeaderboard = require('./wordLeaderboard');
const wait = require('node:timers/promises').setTimeout;
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
        
        await interaction.followUp({ content: `Analyzed past messages for the word: "${wordLeaderboard.getWordToTrack()}" in channel ${channelId}`, ephemeral: true });
    },
};


async function fetchMessages(channel) {
    const fetchedMessages = new Collection();
    let lastId = null;
    const limit = 100;
    let totalFetched = 1;
    let whileLimit = 0;

    console.log("Fetching Messages");

    while (whileLimit < 100) {
        const options = { limit: Math.min(100 - totalFetched, limit) };
        if (lastId) {
            options.before = lastId;
        }

        const messages = await channel.messages.fetch(options);
        whileLimit++;
        console.log(`:${whileLimit} Fetching ${messages.size} messages`);

        if (messages.size === 0 || totalFetched >= 100) {
            break;
        }

        messages.forEach(msg => fetchedMessages.set(msg.id, msg));
        lastId = messages.last().id;
        totalFetched += messages.size;
    }

    console.log(`Total fetched messages: ${fetchedMessages.size}`);

    // Save messages to a JSON file
    saveMessagesToFile(fetchedMessages);

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

function saveMessagesToFile(messages) {
    const messagesArray = Array.from(messages.values()).map(msg => ({
        id: msg.id,
        content: msg.content,
        author: {
            id: msg.author.id,
            username: msg.author.username,
            discriminator: msg.author.discriminator
        },
        createdAt: msg.createdAt
    }));

    const filePath = path.join(__dirname, 'json', 'messages.json');
    fs.writeFileSync(filePath, JSON.stringify(messagesArray, null, 2), 'utf8');
    console.log(`Messages saved to ${filePath}`);
}
