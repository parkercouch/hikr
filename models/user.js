'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      isEmail: {
        msg: 'Not a valid email',
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 24],
          msg: 'Password needs to be 8 to 24 characters',
        },
      },
    },
    dob: DataTypes.DATE,
  }, {
    hooks: {
      beforeCreate: function hashPassword(pendingUser) {
        return bcrypt.hash(pendingUser.password, 12).then((hashedPw) => {
          pendingUser.password = hashedPw;
        });
      },
    },
  });
  user.associate = function userAssociations(models) {
    models.user.belongsToMany(models.conversation, { through: 'userConversation' });
    models.user.hasOne(models.profile);
  };
  user.prototype.isValidPassword = function validPassword(typedInPassword) {
    return bcrypt.compareSync(typedInPassword, this.password);
  };

  return user;
};
