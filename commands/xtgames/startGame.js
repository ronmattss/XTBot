const { SlashCommandBuilder } = require('discord.js');
const { setChannel, instantiateGame, startIntervalInvoker, checkCurrentGames, possibleParticipants } = require('../../core/gameMaster');

module.exports = {
	cooldown: 1,
	data: new SlashCommandBuilder()
		.setName('start-game')
		.setDescription('Start the current game !'),
	async execute(interaction) {
		setChannel(interaction);
		let game = checkCurrentGames(interaction);
		const channelId = '400627470048428042'; // Replace with the ID of the channel you want to send the message to
		const channel = interaction.guild.channels.cache.get(channelId);
		await interaction.reply({ content: 'checking for current games...', ephemeral: false });
		if (game == undefined || game == null) {
			await channel.send("There are no current games Active!");
		}
		else {
			await channel.send("Starting current game...");
			game.isActive = true;
			startIntervalInvoker();
			await channel.send("Welcome to XT Games");
			await channel.send("Every one hour a random event will occur for testing purposes");
			// start setInterval function Invoking
			// load all events
		}


		//console.log(game);


		// starts the current game
		// loads all Events that will be used in the game
		// Game will end if only one player remains




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