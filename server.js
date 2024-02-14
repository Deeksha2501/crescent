const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const User = require("./models/User");

const app = express();

//------------ Passport Configuration ------------//
require("./config/passport")(passport);

//------------ DB Configuration ------------//
const db = require("./config/key").MongoURI;

//------------ Mongo Connection ------------//
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.log(err));

//------------ EJS Configuration ------------//
app.use(expressLayouts);
app.use("/assets", express.static("./assets"));
app.set("view engine", "ejs");

const MongoStore = require("connect-mongo");

//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("tiny"));

//------------ Express session Configuration ------------//
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session());

//------------ Connecting flash ------------//
app.use(flash());

//------------ Global variables ------------//
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/test" , (req, res)=>{
  res.render('profile');
})

app.use("/auth", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));
app.use("/user", require("./routes/user"))
app.use("/", require("./routes/index") )

// app.use("/", (req, res) => {
//   // let id = null;
//   // if (req.user) id = req.user._id;
//   // console.log(req.user);
//   // console.log(id);
//   // console.log(id === null);
//     res.render('home');
//   // res.render("category", { id: id });
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on PORT ${PORT}`));
