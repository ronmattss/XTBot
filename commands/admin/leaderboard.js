const { SlashCommandBuilder } = require('discord.js');
const wordLeaderboard = require('./wordLeaderboard');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the leaderboard for the tracked word'),
    async execute(interaction) {
        const filePath = path.join(__dirname, `${wordLeaderboard.getWordToTrack()}.json`);
        if (!fs.existsSync(filePath)) {
            await interaction.reply({ content: `No leaderboard data found for the word "${wordLeaderboard.getWordToTrack()}".`, ephemeral: true });
            return;
        }

        const leaderboard = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let leaderboardMessage = `Leaderboard for the word "${wordLeaderboard.getWordToTrack()}":\n`;

        for (const [user, count] of Object.entries(leaderboard)) {
            leaderboardMessage += `<@${user}>: ${count} times\n`;
        }

        await interaction.reply({ content: leaderboardMessage || 'No data yet.', ephemeral: false });
    }
};
