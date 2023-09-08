const { SlashCommandBuilder } = require('@discordjs/builders');
const UserDAO = require('../data_access/userDAO');
const { accessDeniedMessage } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Make Bloometti say whatever you want.')
        .addStringOption(option =>
            option.setName('message')
            .setDescription('The message you want Bloometti to say.')
            .setRequired(true)),

	async execute(interaction, client) {
        const user = await UserDAO.getUserByDiscordId(interaction.user.id);
        // Verify if user has permission to use the command
        if (user.rank != 'developer') { 
            await interaction.reply({ ephemeral: true, content: accessDeniedMessage});
            return;
        }

        await interaction.channel.send(interaction.options.getString('message'));
        await interaction.reply({ ephemeral: true, content: 'Message sent.' });
	}
};