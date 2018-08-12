var express = require("express");
var router = express.Router();
const User = require("../models/user");

// Home Page
router.get("/", (req, res, next) => {
  res.render("index");
});

// Register Page
router.get("/register", (req, res, next) => {
  res.render("register/register");
});

// Login Page
router.get("/login", (req, res, next) => {
  res.render("login/login");
});

// POST Register submit
router.post("/register", (req, res, next) => {
  const { name, email, username, password, c_password } = (user = req.body);

  //  Validate form info
  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("email", "Email field is required").notEmpty();
  req.checkBody("email", "Email is not a valid email address").isEmail();
  req.checkBody("username", "Username field is required").notEmpty();
  req.checkBody("password", "Password field is required").notEmpty();
  req.checkBody("c_password", "Passwords do not match").equals(password);

  //  Log errors
  const errors = req.validationErrors();
  if (errors) {
    res.render("register/register", { errors });
  } else {
    //  Success, no errors
    const newUser = {
      name,
      email,
      username,
      password
    };

    User.registerUser(newUser, (err, user) => {
      if (err) throw err;
      req.flash("success_msg", "You can login now");
      res.redirect("/login");
    });
  }
});
module.exports = router;
