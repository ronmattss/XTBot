const { SlashCommandBuilder } = require('discord.js');
const { randomlySelectAParticipant, removeParticipantInGame, instantiateGame, possibleParticipants } = require('../../core/gameMaster');

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('removeparticipant')
        .setDescription('DEBUG: Remove participant from the game'),
    async execute(interaction) {
        //TODO: Create an option to remove other players
        const channelId = '400627470048428042'; // Replace with the ID of the channel you want to send the message to
        const channel = interaction.guild.channels.cache.get(channelId);
        //remove participant from the game
        const user = randomlySelectAParticipant();
       // removeParticipantInGame(user);
        const mention = `<@${user.id}>`;
        await interaction.reply({ content: "Removing player...", ephemeral: false });
        await channel.send(`${mention} + Some custom Event Message here`);



        // 
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