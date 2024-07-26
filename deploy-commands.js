const { REST, Routes } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
const token = process.env.DISCORD_TOKEN;
const clientId = '1122447858860314685';
//const clientId = process.env.DISCORD_CLIENT;
const guildId = '400626052197646336';
//const guildId = process.env.DISCORD_GUILD;
for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
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

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Fetch the existing commands
        const existingCommands = await rest.get(
            Routes.applicationGuildCommands(clientId, process.env.GUILD_ID)
        );

        // Filter out commands that are already registered
        const newCommands = commands.filter(cmd => 
            !existingCommands.some(existingCmd => existingCmd.name === cmd.name)
        );

        // Register new commands without removing existing ones
        for (const command of newCommands) {
            await rest.post(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: command }
            );
        }

        console.log(`Successfully added ${newCommands.length} new commands.`);
    } catch (error) {
        console.error(error);
    }
})();
