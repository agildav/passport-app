const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//  User Schema
const userSchema = mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String
});

//  Compile schema into model and export it
const User = (module.exports = mongoose.model("User", userSchema));

//  registerUser method
module.exports.registerUser = function(newUser, callback) {
  //  Encrypt the password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      }
      //  Save in the DB
      newUser.password = hash;
      User.create(newUser, callback);
    });
  });
};
