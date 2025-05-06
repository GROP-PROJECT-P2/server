'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.hasMany(models.RoomUser)
      Room.hasMany(models.Message)
    }
  }
  Room.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Room is required" },
        notNull: { msg: "Room is required" }
      }
    },
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};