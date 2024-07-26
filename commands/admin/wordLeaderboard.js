const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
let wordToTrack = 'crack';
let leaderboard = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the leaderboard for the tracked word'),
    async execute(interaction) {
        let leaderboardMessage = `Leaderboard for the word "${wordToTrack}":\n`;

        for (const [user, count] of Object.entries(leaderboard)) {
            leaderboardMessage += `${user}: ${count} times\n`;
        }

        await interaction.reply({ content: leaderboardMessage || 'No data yet.', ephemeral: true }); // change ephemeral to false once everything is okay
    },
    getWordToTrack() {
        return wordToTrack;
    },
    updateLeaderboard(userId) {
        if (leaderboard[userId]) {
            leaderboard[userId]++;
        } else {
            leaderboard[userId] = 1;
        }
    }
};
