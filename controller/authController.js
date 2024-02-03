const passport = require("passport");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require("jsonwebtoken");
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";
require("dotenv").config();
const { initializeApp } =  require("firebase/app");
const multer = require("multer");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");

// const config = require('./config/firebase');
//Initialize a firebase application
// const app = initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

const { sendMail } = require("../utils/genUtils");
// const {uploadFile} = require('../utils/fileUploader');

//------------ User Model ------------//
const User = require("../models/User");

//------------ Register Handle ------------//
exports.registerHandle = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, password2 } = req.body;
    console.log({ name, email, password, password2 });
    let errors = [];

    //------------ Checking required fields ------------//
    if (!name || !email || !password || !password2) {
      errors.push({ msg: "Please enter all fields" });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
      errors.push({ msg: "Passwords do not match" });
    }

    //------------ Checking password length ------------//
    // if (password.length < 8) {
    //   errors.push({ msg: "Password must be at least 8 characters" });
    // }

    if (errors.length > 0) {
      res.render("register", {
        errors,
        name,
        email,
        password,
        password2,
      });
    } else {
      //------------ Validation passed ------------//
      User.findOne({ email: email }).then((user) => {
        if (user) {
          //------------ User already exists ------------//

          errors.push({ msg: "Email ID already registered" });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
          });
        } else {
          const token = jwt.sign({ name, email, password }, JWT_KEY, {
            expiresIn: "30m",
          });
          const CLIENT_URL = "http://" + req.headers.host;
          const ur = `${CLIENT_URL}/auth/activate/${token}`;
          console.log({ ur });
          const body = `
          Dear User,
          Thanks You for signing up at Crescent.

          <h4>To activate your account, you must click on the link below:</h4>
          <p>
              <a href="${ur}">Activate Account</a>
          </p>
          <p><b>NOTE: </b> The above activation link expires in ⏱ 30 minutes. ⏱ </p>

          <p> Have fun, and don't hesitate to contact us with your feedback. </p>
          `;

          const subject = "Account Verification: Crescent 💍 ";
          const error_flash =
            "Something went wrong on our end. Please register again.";
          const success_flash =
            "Activation link sent to email ID. Please activate to log in.";
          const success_redirect_url = "/auth/login";
          const failure_redirect_url = "/auth/register";
          sendMail(
            req,
            res,
            email,
            subject,
            body,
            success_redirect_url,
            failure_redirect_url,
            success_flash,
            error_flash
          );
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.render("error_500");
  }
};

//------------ Activate Account Handle ------------//
exports.activateHandle = async (req, res) => {
  try {
    const token = req.params.token;
    let errors = [];
    if (token) {
      jwt.verify(token, JWT_KEY, (err, decodedToken) => {
        if (err) {
          req.flash(
            "error_msg",
            "Incorrect or expired link! Please register again."
          );
          res.redirect("/auth/register");
        } else {
          const { name, email, password } = decodedToken;
          console.log({ name, email, password });
          User.findOne({ email: email }).then((user) => {
            if (user) {
              //------------ User already exists ------------//
              req.flash(
                "error_msg",
                "Email ID already registered! Please log in."
              );
              res.redirect("/auth/login");
            } else {
              const newUser = new User({
                name,
                email,
                password,
              });

              bcryptjs.genSalt(10, (err, salt) => {
                bcryptjs.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then((user) => {
                      console.log(user);
                      req.flash(
                        "success_msg",
                        "Account activated. You can now log in."
                      );
                      res.redirect("/auth/login");
                    })
                    .catch((err) => console.log(err));
                });
              });
            }
          });
        }
      });
    } else {
      console.log("Account activation error!");
    }
  } catch (err) {
    console.log(err);
    res.render("error_500");
  }
};

//------------ Forgot Password Handle ------------//
exports.forgotPassword = (req, res) => {
  try {
    const { email } = req.body;

    let errors = [];

    //------------ Checking required fields ------------//
    if (!email) {
      errors.push({ msg: "Please enter an email ID" });
    }

    if (errors.length > 0) {
      res.render("forgot", {
        errors,
        email,
      });
    } else {
      User.findOne({ email: email }).then((user) => {
        if (!user) {
          //------------ User already exists ------------//
          errors.push({ msg: "User with Email ID does not exist!" });
          res.render("forgot", {
            errors,
            email,
          });
        } else {
          const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, {
            expiresIn: "30m",
          });
          const CLIENT_URL = "http://" + req.headers.host;
          const ur = `${CLIENT_URL}/auth/forgot/${token}`;
          console.log({ ur });
          const body = `
            Dear User,
            Thanks You for visiting Crescent.
  
            <h4>Please click on below link to reset your account password:</h4>
            <p>
                <a href="${ur}">Reset your password</a>
            </p>
            <p><b>NOTE: </b> The above activation link expires in ⏱ 30 minutes. ⏱ </p>
  
            <p> Have fun, and don't hesitate to contact us with your feedback. </p>
        `;

          const subject = "Account Password Reset: Crescent 💍";
          const error_flash =
            "Something went wrong on our end. Please try again.";
          const success_flash =
            "Password reset link sent to email ID. Please follow the instructions.";
          const success_redirect_url = "/auth/login";
          const failure_redirect_url = "/auth/forgot";
          sendMail(
            req,
            res,
            email,
            subject,
            body,
            success_redirect_url,
            failure_redirect_url,
            success_flash,
            error_flash
          );
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.render("error_500");
  }
};

//------------ Redirect to Reset Handle ------------//
exports.gotoReset = (req, res) => {
  try {
    const { token } = req.params;

    if (token) {
      jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
        if (err) {
          req.flash(
            "error_msg",
            "Incorrect or expired link! Please try again."
          );
          res.redirect("/auth/login");
        } else {
          const { _id } = decodedToken;
          console.log({ _id });
          User.findById(_id).then((user, err) => {
            if (err) {
              console.log("gadbad");
              console.log({ err });
              req.flash(
                "error_msg",
                "User with email ID does not exist! Please try again."
              );
              res.redirect("/auth/login");
            } else {
              res.redirect(`/auth/reset/${_id}`);
            }
          });
        }
      });
    } else {
      console.log("Password reset error!");
    }
  } catch (err) {
    console.log(err);
    res.render("error_500");
  }
};

exports.resetPassword = (req, res) => {
  try {
    var { password, password2 } = req.body;
    const id = req.params.id;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!password || !password2) {
      req.flash("error_msg", "Please enter all fields.");
      res.redirect(`/auth/reset/${id}`);
    }

    //------------ Checking password length ------------//
    else if (password.length < 8) {
      req.flash("error_msg", "Password must be at least 8 characters.");
      res.redirect(`/auth/reset/${id}`);
    }

    //------------ Checking password mismatch ------------//
    else if (password != password2) {
      req.flash("error_msg", "Passwords do not match.");
      res.redirect(`/auth/reset/${id}`);
    } else {
      bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(password, salt, (err, hash) => {
          if (err) throw err;
          password = hash;

          User.findByIdAndUpdate({ _id: id }, { password }).then(function (
            result,
            err
          ) {
            if (err) {
              req.flash("error_msg", "Error resetting password!");
              res.redirect(`/auth/reset/${id}`);
            } else {
              req.flash("success_msg", "Password reset successfully!");
              res.redirect("/auth/login");
            }
          });
        });
      });
    }
  } catch (err) {
    console.log(err);
    res.render("error_500");
  }
};

//------------ Login Handle ------------//
exports.loginHandle = (req, res, next) => {
  console.log(req.body);
  try {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/auth/login",
      failureFlash: false,
    })(req, res, next);
  } catch (err) {
    console.log(err);
    res.render("error_500");
  }
};

//------------ Logout Handle ------------//
exports.logoutHandle = (req, res) => {
  try {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
    res.render("error_500");
  }
};

exports.uploadHandle = async (req, res)=>{
    try{
        const dateTime = giveCurrentDateTime();

        const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);

        // Create file metadata including the content type
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log('File successfully uploaded.');
        return res.send({
            message: 'file uploaded to firebase storage',
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL
        })
    }catch(err){
        res.send(err);
    }
}

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}
