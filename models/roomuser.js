'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomUser.belongsTo(models.User)
      RoomUser.belongsTo(models.Room)
    }
  }
  RoomUser.init({
    RoomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "RoomId is required" },
        notNull: { msg: "RoomId is required" }
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
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RoomUser',
  });
  return RoomUser;
};