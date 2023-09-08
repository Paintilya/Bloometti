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

  static async getAllUsers() {
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
}

module.exports = UserDAO;