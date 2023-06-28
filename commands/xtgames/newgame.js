const { SlashCommandBuilder } = require('discord.js');
const { instantiateGame, possibleParticipants } = require('../../core/gameMaster');

module.exports = {
	cooldown: 1,
	data: new SlashCommandBuilder()
		.setName('newgame')
		.setDescription('Start a new game !'),
	async execute(interaction) {
		// check if there are current games active:
		// if none then create new one
		// if there is one then select it and prompt currently on-going
		// add participants

		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply({ content: 'checking for current games...', ephemeral: true });
		let game = instantiateGame("XT GAMES",5);
		console.log(game.participants.length);




		// const channelId = '400627470048428042'; // Replace with the ID of the channel you want to send the message to
		// const channel = interaction.guild.channels.cache.get(channelId);
		// game.participants.forEach(async (participant) => {
		// 	try {
		// 		const user = participant;
		// 		console.log(user);
		// 		// Mention the user by using their user ID and the "@" symbol
		// 		const mention = `<@${user.id}>`;

		// 		// Send a message to the specified channel mentioning the user
		// 		await channel.send(`${mention} Test don't mind me`);
		// 		console.log(`Message sent to ${user.username}`);
		// 	} catch (error) {
		// 		console.error(`Failed to send message to ${user.username}: ${error}`);
		// 	}
		// });

	},
};