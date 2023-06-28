const { Events } = require('discord.js');
const fileWriter = require('../helpers/jsonWriter.js')
const master = require('../core/gameMaster.js')

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		// when starting bot, check all participant lists
       // fileWriter.addDummyJSON('../files/tests','dummy.json');
	  master.initializeParticipants();
	  master.checkForGames();
	},
};
