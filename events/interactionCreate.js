const { mongoose } = require('../data_access/db');

module.exports = {
    name: 'interactionCreate',
    execute(interaction, client) {
        if (interaction.isCommand()) {
            // Retrieve command from commands collection
            const command = client.commands.get(interaction.commandName);

            // If command not found
            if (!command) return;
        
            try {
                command.execute(interaction, client);
            } catch (error) { // If an error occurs during command execution
                console.error(error);
                interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}