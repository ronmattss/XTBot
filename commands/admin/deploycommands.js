const { SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deploy-commands')
        .setDescription('Deploys new slash commands'),
    async execute(interaction) {
        const clientId = process.env.CLIENT_ID;
        const guildId = process.env.GUILD_ID;
        const token = process.env.DISCORD_TOKEN;
        
        const commands = [];
        const foldersPath = path.join(__dirname, 'commands');
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(path.join(commandsPath, file));
                commands.push(command.data.toJSON());
            }
        }

        const rest = new REST({ version: '9' }).setToken(token);

        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.');
            await interaction.reply({ content: 'Successfully reloaded application (/) commands.', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to reload application (/) commands.', ephemeral: true });
        }
    },
};