'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Friend.belongsTo(models.User)
    }
  }
  Friend.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    friendId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pending'
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'https://i.pinimg.com/736x/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg'
    }
  }, {
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};