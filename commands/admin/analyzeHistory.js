const { SlashCommandBuilder, Collection } = require('discord.js');
const wordLeaderboard = require('./wordLeaderboard');
const fs = require('fs');
const path = require('path');

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
        await interaction.editReply("Messages fetched, analyzing...");

        analyzeMessages(fetchedMessages);

        await interaction.followUp({ content: `Analyzed past messages for the word: "${wordLeaderboard.getWordToTrack()}" in channel ${channelId}`, ephemeral: true });
    },
};

async function fetchMessages(channel) {
    const fetchedMessages = new Collection();
    let lastId = null;
    const limit = 100;
    let totalFetched = 0;

    console.log("Fetching Messages");

    while (totalFetched < 100) {
        const options = { limit: Math.min(100 - totalFetched, limit) };
        if (lastId) {
            options.before = lastId;
        }

        const messages = await channel.messages.fetch(options);
        console.log(`Fetched ${messages.size} messages`);

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

// Function to read existing messages from the file
function readExistingMessages(filePath) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

function saveMessagesToFile(messages) {
    const messagesArray = Array.from(messages.values()).map(message => ({
        id: message.id,
        content: message.content,
        author: {
            id: message.author.id,
            username: message.author.username,
            discriminator: message.author.discriminator
        },
        createdAt: message.createdAt
    }));

    const filePath = path.join(__dirname, '../../json/messageHistory.json');

    // Ensure the directory exists
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    // Read existing messages and combine with new ones
    const existingMessages = readExistingMessages(filePath);
    const combinedMessages = existingMessages.concat(messagesArray);

    fs.writeFileSync(filePath, JSON.stringify(combinedMessages, null, 2), 'utf8');
    console.log(`Messages saved to ${filePath}`);
}
