const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Initialize wordToTrack and leaderboard
let wordToTrack = '';
let leaderboard = {};

// Helper functions to get and set wordToTrack
function getWordToTrack() {
    return wordToTrack;
}

function setWordToTrack(newWord) {
    wordToTrack = newWord;
    const filePath = path.join(__dirname, `${newWord}.json`);
    if (fs.existsSync(filePath)) {
        leaderboard = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
        leaderboard = {};
        fs.writeFileSync(filePath, JSON.stringify(leaderboard, null, 2));
    }
}

// Helper function to update the leaderboard
function updateLeaderboard(userId) {
    if (leaderboard[userId]) {
        leaderboard[userId]++;
    } else {
        leaderboard[userId] = 1;
    }
    const filePath = path.join(__dirname, `${wordToTrack}.json`);
    fs.writeFileSync(filePath, JSON.stringify(leaderboard, null, 2));
}

// Export the module with the command data and execute function
module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the leaderboard for the tracked word'),
    async execute(interaction) {
        const filePath = path.join(__dirname, `${wordToTrack}.json`);
        if (!fs.existsSync(filePath)) {
            await interaction.reply({ content: `No leaderboard data found for the word "${wordToTrack}".`, ephemeral: true });
            return;
        }

        const leaderboard = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let leaderboardMessage = `Leaderboard for the word "${wordToTrack}":\n`;

        for (const [user, count] of Object.entries(leaderboard)) {
            leaderboardMessage += `<@${user}>: ${count} times\n`;
        }

        await interaction.reply({ content: leaderboardMessage || 'No data yet.', ephemeral: false });
    },
    getWordToTrack,
    setWordToTrack,
    updateLeaderboard,
};
