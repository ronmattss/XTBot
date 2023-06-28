const { SlashCommandBuilder } = require('discord.js');
const { addUserToListOfParticipants, possibleParticipants } = require('../../core/gameMaster');

module.exports = {
	cooldown: 1,
	data: new SlashCommandBuilder()
		.setName('joingame')
		.setDescription('Join the next XT Games! You will not join the current active game.'),
	async execute(interaction) {

		// check for current active games (that is not starting)
		// joing game if possible
		// if not, wait for the next game
 // <- save user to possible participants
		const user = interaction.user;
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		// Joining a game is technically an event
		const flag = addUserToListOfParticipants(user);
		if (flag) {
			await interaction.reply({ content: user.username + " is joining the XT Games", ephemeral: false });
		}
		else {
			await interaction.reply({ content: " You aldready joined the game", ephemeral: true });

		}


	},
};