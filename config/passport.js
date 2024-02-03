const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//------------ Local User Model ------------//
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //------------ User Matching ------------//
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          return done(null, false, {
            message: "This email ID is not registered",
          });
        }

        //------------ Password Matching ------------//
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Password incorrect! Please try again.",
            });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  });
};
