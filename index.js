const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits,Intents  } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

//const { token } = require(path.join('C:', 'keys', 'config.json'));
const loginToken = process.env.DISCORD_TOKEN;
const app = express();
const port = 3000; // You can change the port if needed
const notificationChannelId = '1183248453606850570'; // Replace with your channel ID
const notificationUserId = '400626723181428737'; // Replace with the user ID to notify
  // Express middleware to parse JSON requests
  app.use(bodyParser.json());
  
  // Endpoint to receive data from Arduino
  app.post('/arduino-data', (req, res) => {
	const { data } = req.body;
	
	// Process the data from Arduino
	console.log('Received data from Arduino:', data);
  
	// You can send a response back if needed
	//res.send('Data received successfully!');
  });
  app.get('/sample', (req, res) => {
	console.log('Hello');
	res.send('Hello from the server!');
  });

  app.post('/sendReadings', (req, res) => {
	// Access the JSON data sent from Arduino
	const jsonData = req.body;
  
	// Process the data as needed
	console.log('Received JSON data:', jsonData);
	sendReadingsToDiscord(jsonData);
	// Send a response if necessary
	res.json({ message: 'Data received successfully' });
  });


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates
    ],
});
global.discordClient = client;
client.commands = new Collection();
client.cooldowns = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Event Handlers

// client.on('voiceStateUpdate', (oldState, newState) => {
// 	const minDelay = 30000; // 10 seconds
//     const maxDelay = 90000; // 60 seconds
//     const disconnectDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
// 	if(oldState.channel)
// 	{
// 		if(oldState.member.user.tag  === "skevved#0")
// 		{
// 			console.log("here");
// 		}
// 	}
// 	setTimeout(() => {
			
// 		// Check if the member is still in a voice channel before disconnecting
// 		if (oldState.member.user.tag === "skevved#0") {
// 			console.log(`${oldState.member.user.tag} disconnecting...`);
// 			// oldState.member.voice.setMute(newState.member.voice)
// 			oldState.member.voice.disconnect();
// 			console.log(`${oldState.member.user.tag} disconnected after n seconds`);
// 		}
// 	}, disconnectDelay);
//     // Check if the member joined a voice channel
//     if (!oldState.channel && newState.channel) {
//         console.log(`${newState.member.user.tag} joined a voice channel: ${newState.channel.name}`);
//         setTimeout(() => {
			
// 			console.log(`disconnecting after ${disconnectDelay}`)
//             // Check if the member is still in a voice channel before disconnecting
//             if (newState.member.user.tag === "skevved#0") {
// 				// newState.member.voice.setMute(newState.member.voice)
// 				newState.member.voice.disconnect();
//                 console.log(`${newState.member.user.tag} disconnected after n seconds`);
//             }
//         }, disconnectDelay);

//         // Do something here, such as sending a message or performing an action
//     }
// });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Register commands with Discord
const rest = new REST({ version: '10' }).setToken(loginToken);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});


function disconnectAfterDelay(member, delay) {

}

client.on('messageCreate', message => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const trackWordCommand = client.commands.get('trackword');
    if (content.includes(trackWordCommand.getWordToTrack().toLowerCase())) {
        trackWordCommand.updateLeaderboard(message.author.id);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const channel = client.channels.cache.get(notificationChannelId);

    if (channel) {
        await channel.send({ content: 'Bot is now online!', ephemeral: true });
    } else {
        console.error(`Notification channel with ID ${notificationChannelId} not found.`);
    }
});

function sendReadingsToDiscord(data) {
	const channel = client.channels.cache.get("1183248453606850570");
  
	if (channel) {
	  const timestamp = new Date().toLocaleString(); // Get the current date and time
  
	  const message = `
		**Timestamp:** ${timestamp}
		**Temperature:** ${data.bme280.currentTemp} °C
		**Humidity:** ${data.bme280.currentHumidity} %
		**Altitude:** ${data.bme280.currentAltitude} meters
		**Pressure:** ${data.bme280.currentPressure} hPa
		**PPM:** ${data.currentPPM}
	  `;
  
	  channel.send(message);
	} else {
	  console.error(`Channel with ID ${"1183248453606850570"} not found.`);
	}
  }

  // Start the Express server
  const serverIPAddress = require('ip').address();
  console.log(`Server IP Address: ${serverIPAddress}`);
  
  // Start the Express server
  const server = app.listen(port, () => {
	console.log(`Express server listening on http://${serverIPAddress}:${port}`);
  });

client.login(loginToken);