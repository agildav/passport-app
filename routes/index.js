var express = require("express");
var router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Home Page
router.get("/", ensureAuthenticated, (req, res, next) => {
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

// Logout
router.get("/logout", (req, res, next) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
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
      if (err) {
        req.flash("error_msg", "User already exists");
        res.redirect("/register");
      } else {
        req.flash("success_msg", "You can login now");
        res.redirect("/login");
      }
    });
  }
});

//  ==  ==  Passport setup  ==  ==
// Local Strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "No user found" });
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Wrong password" });
        }
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});
//  ==  ==  ==  ==

// POST Login request
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error_msg", "You are not authorized to view that page");
    res.redirect("/login");
  }
}

module.exports = router;
