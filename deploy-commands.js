const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const token = process.env.DISCORD_TOKEN;
const clientId = '1122447858860314685';
//const clientId = process.env.DISCORD_CLIENT;
const guildId = '400626052197646336';
//const guildId = process.env.DISCORD_GUILD;

for (const folder of commandFolders) {
    const commandsPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Fetch the existing commands
        const existingCommands = await rest.get(
            Routes.applicationGuildCommands(clientId, guildId)
        );

        // Filter out commands that are already registered
        const newCommands = commands.filter(cmd => 
            !existingCommands.some(existingCmd => existingCmd.name === cmd.name)
        );

        if (newCommands.length > 0) {
            // Register only new commands
            const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: newCommands }
            );
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } else {
            console.log('No new commands to register.');
        }
    } catch (error) {
        console.error(error);
    }
})();


