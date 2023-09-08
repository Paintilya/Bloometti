const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const UserDAO = require('../data_access/userDAO');
const Canvas = require('@napi-rs/canvas');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('See your profile.'),
        
	async execute(interaction, client) {
		const user = await UserDAO.getUserByDiscordId(interaction.user.id);

		// In case the user does not exist in the database
		if (user == null) {
			await interaction.reply({ ephemeral: user.ephemeralMode, content: 'You aren\'t registered yet. Send a message in any text channel to be registered.' });
			return;
		}
		
		// Generate progress bar
		const progressBar = await createProgressBar();
		fillProgressBar(progressBar, user);
		const attachment = new AttachmentBuilder(await progressBar.canvas.encode('png'), { name: 'progress-bar.png'}); // Export canvas to an image
		// Generate the embed
		const embed = await createEmbed(user, interaction);
		// Output to user
			interaction.reply({ephemeral: user.ephemeralMode, embeds: [embed], files: [attachment]});
	}
};

async function createEmbed(user, interaction) {
    return new EmbedBuilder()
        .setColor(user.color)
        .setAuthor({ name: `${user.username}`, iconURL: `${interaction.user.avatarURL()}` })
        .addFields(
            {name: `Level ${user.chatting.level}`, value: `${user.chatting.expTowardsNextLevel} / ${(user.chatting.level * (user.chatting.level + 1)) * 50}`, inline: true},
        )
        .setImage('attachment://progress-bar.png')
        .setTimestamp()
};

async function createProgressBar() {
    const canvas = Canvas.createCanvas(1000, 25);
    const context = canvas.getContext('2d');
    const background = await Canvas.loadImage('./media/progressBarBackground.jpg');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    return { context, canvas };
};

// Determines the completion percentage of the current level and fills the progress bar accordingly
function fillProgressBar(progressBar, user) {
    const levelCompletionPercentage = Math.floor((user.chatting.expTowardsNextLevel / ((user.chatting.level * (user.chatting.level + 1)) * 100)) * 100);

    progressBar.context.fillStyle = user.color;
    progressBar.context.fillRect(0, 0, 1000 * (levelCompletionPercentage / 100), 25);
};