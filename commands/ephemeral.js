const { SlashCommandBuilder } = require('@discordjs/builders');
const UserDAO = require('../data_access/userDAO');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ephemeral')
		.setDescription('Toggle the ephemeral mode'),

	async execute(interaction, client) {
        const user = await UserDAO.getUserByDiscordId(interaction.user.id);

        switch (user.ephemeralMode) {
            case true:
                await UserDAO.updateUser(user.discordId, { ephemeralMode: false });
                interaction.reply({ ephemeral: true, content: 'Ephemeral mode toggled off.' });
                break;
            
            case false:
                await UserDAO.updateUser(user.discordId, { ephemeralMode: true });
                interaction.reply({ ephemeral: true, content: 'Ephemeral mode toggled on.' });
                break;

            default:
                interaction.reply({ ephemeral: true, content: 'There was an unexpected error.' });
                console.log('Ephemeral error');
                break;
        }
	}
};