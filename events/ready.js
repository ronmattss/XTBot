const { Events } = require('discord.js');
const fileWriter = require('../helpers/jsonWriter.js')

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        fileWriter.addDummyJSON('../files/tests','dummy.json');
	},
};
