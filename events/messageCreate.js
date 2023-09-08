const UserDAO = require('../data_access/userDAO');
const utils = require('../utils/utils');
const { blink, chattingExpMultiplier, chattingExpDelayInSeconds, chattingExpMinGain, chattingExpMaxGain } = require('../main_parameters.json');

/*
    Level system
*/

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Prevent bot from being treated as a user
        if (message.author.bot) return;

        var user = await UserDAO.getUserByDiscordId(message.author.id);

        // New users handling
        if (user == null) {
            // Create a new user object with the required data
            const newUser = {
                discordId: `${message.author.id}`,
                username: `${message.author.username}`,
                ephemeralMode: false,
                color: `${blink}`,
                rank: 'none',
                chatting: {
                exp: 0,
                expTowardsNextLevel: 0,
                lastMessageTime: 0,
                level: 1,
                messageCount: 0,
                },
                bankAccount: {
                balance: 0,
                },
            };
            
            // Call the createUser method to save the new user to the database
            UserDAO.createUser(newUser)
                .then((createdUser) => {
                    user = createdUser;
                    console.log('User created successfully:', createdUser);
                })
                .catch((error) => {
                    console.error('Error creating user:', error);
                });
        }
        
        // Update username in case the username has changed
        await UserDAO.updateUser(user.discordId, { username: message.author.username });

        // Verify exp gain cooldown
        if ((utils.timeSinceEpoch() - user.chatting.lastMessageTime) < chattingExpDelayInSeconds) return;

        const gainedExperience = utils.randomInt(chattingExpMinGain, chattingExpMaxGain) * chattingExpMultiplier;
        console.log(user.username + " has gained " + gainedExperience + " xp");

        // Level up handling
        const hasLevelledUp = await hasLevelledUpChatting(user.chatting.level, user.chatting.expTowardsNextLevel + gainedExperience);
        
        if (hasLevelledUp[0]) {
            await UserDAO.updateUser(user.discordId, {
                $set: {
                  'chatting.exp': user.chatting.exp + gainedExperience,
                  'chatting.expTowardsNextLevel': hasLevelledUpChatting[1],
                  'chatting.lastMessageTime': utils.timeSinceEpoch(),
                  'chatting.level': user.chatting.level + 1,
                  'chatting.messageCount': user.chatting.messageCount + 1,
                },
            });
            
            await message.channel.send(`<@${user.discordId}> levelled up to level ${user.chatting.level + 1} ! ୧ʕ•̀ᴥ•́ʔ୨`);
        } else {
            await UserDAO.updateUser(user.discordId, {
                $set: {
                  'chatting.exp': user.chatting.exp + gainedExperience,
                  'chatting.expTowardsNextLevel': user.chatting.expTowardsNextLevel + gainedExperience,
                  'chatting.lastMessageTime': utils.timeSinceEpoch(),
                  'chatting.level': user.chatting.level,
                  'chatting.messageCount': user.chatting.messageCount + 1,
                },
            });
        }
    }
};

// Verify if a user has levelled up and returns an array: [true/false, newExpTowardsNextLevel]
async function hasLevelledUpChatting(level, expTowardsNextLevel) {
    const expNeededToLevelUp = (level * (level + 1)) * 50

    if (expTowardsNextLevel >= expNeededToLevelUp) {
        const newExpTowardsNextLevel = expTowardsNextLevel - expNeededToLevelUp;
        return [true, newExpTowardsNextLevel];
    }

    return false;
};