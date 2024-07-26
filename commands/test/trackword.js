const { SlashCommandBuilder } = require('discord.js');
const wordLeaderboard = require('./wordLeaderboard');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trackword')
        .setDescription('Sets the word to be tracked')
        .addStringOption(option => 
            option.setName('word')
                .setDescription('The word to track')
                .setRequired(true)),
    async execute(interaction) {
        const newWord = interaction.options.getString('word');
        wordLeaderboard.data.wordToTrack = newWord;
        wordLeaderboard.leaderboard = {}; // Reset leaderboard

        await interaction.reply({ content: `Tracking word set to "${newWord}".`, ephemeral: true });
    }
};
