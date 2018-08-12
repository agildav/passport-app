const express = require("express");
const path = require("path");
const expressHandlebars = require("express-handlebars");
const expressValidator = require("express-validator");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

//  Init app
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

//  ==  ==  Routes  ==  ==
const index = require("./routes/index");
//  ==  ==  ==  ==  ==  ==

// View Engine
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Express Session
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);

// Express messages
app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Express Validator
app.use(
  expressValidator({
    errorFormatter: (param, msg, value) => {
      let namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

//  ==  ==  Router  ==  ==
app.use("/", index);
//  ==  ==  ==  ==  ==  ==

// Start Server
app.listen(port, () => {
  console.log("Server started on port " + port);
});
