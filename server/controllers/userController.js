const User = require('../models/userModel');

const userController = {};

userController.createUser = (usr) => {
  User.create(new User(usr), (err, result) => {
    if (err) {
      return err;
    }
  });
};

module.exports = userController;
