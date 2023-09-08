// Import modules
const fs = require('fs'); // file system module
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json'); // 'config.json' contains secret data such as the super secret Discord Bot login token.
// Create a new client instance
const client = new Client({ 
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
    partials: [Partials.Channel]
});

// Initialize commands collection
client.commands = new Collection();

// Retrieve backend of commands and events handlers from file system
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Load commands handlers to bot
commandFiles.forEach(file => {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
});

eventFiles.forEach(file => {
    const event = require(`./events/${file}`);

    // Load event handlers to bot
    if (event.once)
        client.once(event.name, (...args) => event.execute(...args, client));
    else
        client.on(event.name, (...args) => event.execute(...args, client));
});

// Connect to Discord
client.login(token);