const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const wordLeaderboard = require('./wordLeaderboard');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the leaderboard for the tracked word'),
    async execute(interaction) {
        const wordToTrack = wordLeaderboard.getWordToTrack();
        const filePath = path.join(__dirname, 'json', 'messages.json');

        if (!fs.existsSync(filePath)) {
            await interaction.reply({ content: `No message data found to analyze for the word "${wordToTrack}".`, ephemeral: true });
            return;
        }

        const messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const leaderboard = calculateLeaderboard(messages, wordToTrack);

        let leaderboardMessage = `Leaderboard for the word "${wordToTrack}":\n`;

        for (const [user, count] of Object.entries(leaderboard)) {
            leaderboardMessage += `<@${user}>: ${count} times\n`;
        }

        await interaction.reply({ content: leaderboardMessage || 'No data yet.', ephemeral: false });
    }
};

function calculateLeaderboard(messages, wordToTrack) {
    const leaderboard = {};

    messages.forEach(message => {
        const content = message.content.toLowerCase();
        if (content.includes(wordToTrack.toLowerCase())) {
            if (leaderboard[message.author.id]) {
                leaderboard[message.author.id]++;
            } else {
                leaderboard[message.author.id] = 1;
            }
        }
    });

    return leaderboard;
}
