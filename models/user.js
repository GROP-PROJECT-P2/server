'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Message)
      User.hasMany(models.RoomUser)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "Username must be unique" },
      validate: {
        notEmpty: { msg: "Username is required" },
        notNull: { msg: "Username is required" }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "Email must be unique" },
      validate: {
        notEmpty: { msg: "Email is required" },
        notNull: { msg: "Email is required" },
        isEmail: { msg: "Invalid email format" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password is required" },
        notNull: { msg: "Password is required" }
      }
    },
    status: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user) => {
    user.password = hashPassword(user.password)
  })
  return User;
};