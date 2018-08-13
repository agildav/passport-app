const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//  User Schema
const userSchema = mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    validate: {
      isAsync: true,
      validator: function(value, isValid) {
        const self = this;
        return self.constructor
          .findOne({ username: value })
          .exec(function(err, user) {
            if (err) {
              throw err;
            } else if (user) {
              if (self.id === user.id) {
                // if finding and saving then it's valid even for existing username
                return isValid(true);
              }
              return isValid(false);
            } else {
              return isValid(true);
            }
          });
      },
      message: "The username address is already taken!"
    }
  },
  email: {
    type: String,
    required: true,
    validate: {
      isAsync: true,
      validator: function(value, isValid) {
        const self = this;
        return self.constructor
          .findOne({ email: value })
          .exec(function(err, user) {
            if (err) {
              throw err;
            } else if (user) {
              if (self.id === user.id) {
                // if finding and saving then it's valid even for existing email
                return isValid(true);
              }
              return isValid(false);
            } else {
              return isValid(true);
            }
          });
      },
      message: "The email address is already taken!"
    }
  },
  password: String
});

//  Compile schema into model and export it
const User = (module.exports = mongoose.model("User", userSchema));

module.exports.registerUser = function(newUser, callback) {
  //  Encrypt the password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        //  Save in the DB
        newUser.password = hash;
        User.create(newUser, callback);
      }
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
