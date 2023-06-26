const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 1,
	data: new SlashCommandBuilder()
		.setName('newgame')
		.setDescription('Start a new game !'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply({content:'checking for current games...', ephemeral: true});
	},
};