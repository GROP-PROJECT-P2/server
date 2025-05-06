'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.User)
      Message.belongsTo(models.Room)
    }
  }
  Message.init({
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Content is required" },
        notNull: { msg: "Content is required" }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "UserId is required" },
        notNull: { msg: "UserId is required" }
      }
    },
    isBot: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: { msg: "IsBot is required" },
        notNull: { msg: "IsBot is required" }
      }
    },
    RoomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "RoomId is required" },
        notNull: { msg: "RoomId is required" }
      }
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};