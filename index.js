const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Intents } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const config = require('./wordTrackerConfig.json');
const wordLeaderboard = require('./commands/admin/wordLeaderboard');

const { debug } = require('node:console');
const messagesFilePath = path.join(__dirname, 'json', 'messages.json');
//const { token } = require(path.join('C:', 'keys', 'config.json'));
const loginToken = process.env.DISCORD_TOKEN;
const clientID = process.env.DISCORD_CLIENT;
const guildID = process.env.DISCORD_GUILD;
const app = express();
const port = 4000; // You can change the port if needed
const notificationChannelId = '1183248453606850570'; // Replace with your channel ID
const notificationUserId = '400626723181428737'; // Replace with the user ID to notify
const clientId = '1122447858860314685';
const guildId = '400626052197646336';
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
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildEmojisAndStickers,
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
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}


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

// Ensure the directory exists
if (!fs.existsSync(path.dirname(messagesFilePath))) {
  fs.mkdirSync(path.dirname(messagesFilePath), { recursive: true });
}


// Load existing messages or initialize an empty array
let messages = [];
if (fs.existsSync(messagesFilePath)) {
    messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
} else {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
}
// Initialize tracked word from config
const initialWord = config.initialWord;
wordLeaderboard.setWordToTrack(initialWord);


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





function disconnectAfterDelay(member, delay) {

}

client.on('messageCreate', message => {
  if (message.author.bot) return;

  const messageData = {
    id: msg.id,
    content: msg.content,
    author: {
        id: msg.author.id,
        username: msg.author.username,
        discriminator: msg.author.discriminator
    },
    createdAt: msg.createdAt
  };

  messages.push(messageData);
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
  console.log(`Message from ${message.author.tag} saved.`);
});


client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const channel = client.channels.cache.get(notificationChannelId);

  if (channel) {
    await channel.send({ content: 'Bot is now online!', ephemeral: true });
  } else {
    console.error(`Notification channel with ID ${notificationChannelId} not found.`);
  }
  // await deployCommands();
});

// client.on('interactionCreate', async interaction => {
//   if (!interaction.isCommand()) return;

//   const command = client.commands.get(interaction.commandName);

//   if (!command) return;

//   try {
//       console.log(`Attempting to execute ${interaction.commandName}`);
//       await command.execute(interaction);
//   } catch (error) {
//       console.error(`Error executing ${interaction.commandName}`, error);
//       if (interaction.replied || interaction.deferred) {
//           await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
//       } else {
//           await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
//       }
//   }
// });

// Deploy commands when the bot starts
const deployCommands = async () => {
  const commands = [];
  for (const [name, command] of client.commands) {
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: '10' }).setToken(loginToken);
  try {
    console.log('Started refreshing application (/) commands.');

    const existingCommands = await rest.get(
      Routes.applicationGuildCommands(clientId, guildId)
    );

    const newCommands = commands.filter(cmd =>
      !existingCommands.some(existingCmd => existingCmd.name === cmd.name)
    );

    for (const command of newCommands) {
      await rest.post(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: command }
      );
    }

    console.log(`Successfully added ${newCommands.length} new commands.`);
  } catch (error) {
    console.error(error);
  }
};

deployCommands();

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


//   client.on('interactionCreate', async interaction => {
//     if (!interaction.isCommand()) return;

//     const command = client.commands.get(interaction.commandName);

//     if (!command) return;

//     try {
//         console.log(`attempting to interact ${interaction.commandName}`);
//         await command.execute(interaction);
//     } catch (error) {
//         console.error(error);
//         if (!interaction.replied) {
//             await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
//         }
//     }
// });

console.log("NEW Build!");
client.login(loginToken);