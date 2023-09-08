const User = require('../models/user'); // Import your user model

class UserDAO {
  static async createUser(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  static async getUserByDiscordId(id) {
    try {
      return await User.findOne({ discordId: id });
    } catch (error) {
      throw error;
    }
  }

  static async findAllUsers() {
    try {
      return await User.find({});
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(discordId, newData) {
    try {
      return await User.findOneAndUpdate({ "discordId": discordId }, newData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  static async deleteUserByDiscordId(discordId) {
    try {
      return await User.findOneAndRemove({ "discordId": discordId });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserDAO;