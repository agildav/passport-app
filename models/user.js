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
      //  TODO: handle repeated user
      User.create(newUser, callback);
    });
  });
};

module.exports.getUserByUsername = function(username, callback) {
  const query = { username: username };
  User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
