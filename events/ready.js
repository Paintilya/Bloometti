module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}\n\nGuilds:`);
        console.log(client.guilds.cache.map((guild) => guild.name).join('\n'));
    }
};