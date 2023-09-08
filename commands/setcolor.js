const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const UserDAO = require('../data_access/userDAO');
const Canvas = require('@napi-rs/canvas');

const validHexPattern = /^#[0-9A-F]{6}$/i;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setcolor')
		.setDescription('Set the color that the bot will use for you.')
        .addStringOption(option =>
            option.setName('hexcode')
                .setDescription('Color code (Hexadecimal, e.g.: "#FE0C56"; use a color picker to find the hex code of a color)')
                .setRequired(true)),

	async execute(interaction, client) {
        const user = await UserDAO.getUserByDiscordId(interaction.user.id);
        const userInput = interaction.options.getString('hexcode');

        switch (validHexPattern.test(userInput)) {
            case true:
                await UserDAO.updateUser(user.discordId, { color: userInput });
                const squareImage = createColorSquareImage(userInput);
                const embed = createEmbed(userInput);
                const attachment = new AttachmentBuilder(await squareImage.canvas.encode('png'), { name: 'color.png' });
                interaction.reply({ ephemeral: user.ephemeralMode, embeds: [embed], files: [attachment]});
                break;

            case false:
                console.log('Invalid hex code');
                interaction.reply({ ephemeral: user.ephemeralMode , content: 'This isn\'t a valid hex code. Hex codes must look like this: `#FE0C56`'});
                break;

            default:
                console.log('Unexpected error');
                interaction.reply({ ephemeral: user.ephemeralMode , content: 'Unexpected error.'});
                break;
        }

            
	}
};

function createColorSquareImage(colorCode) {
    const canvas = Canvas.createCanvas(32, 32);
    const context = canvas.getContext('2d');

    context.fillStyle = colorCode;
    context.fillRect(0, 0, canvas.width, canvas.height)

    return { canvas, context };
};

function createEmbed(colorCode) {
    const embed = new EmbedBuilder()
    .setColor(colorCode)
    .setTitle(`Color set to: ${colorCode.toUpperCase()}`)
    .setImage('attachment://color.png');

    return embed;
};