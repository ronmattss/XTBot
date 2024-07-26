const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        // Defer the reply to avoid interaction timeout
        await interaction.deferReply({ ephemeral: true });
        
        // Simulate a delay if needed (optional)
        await wait(1000);

        // Edit the reply with the final message
        await interaction.editReply({ content: 'Pong!', ephemeral: true });
    },
};
