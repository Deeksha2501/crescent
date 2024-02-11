// add products
// add categories

const passport = require("passport");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require("jsonwebtoken");
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";
require("dotenv").config();
const { initializeApp } = require("firebase/app");
const multer = require("multer");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const Category = require("../models/Category");
const Product = require("../models/Product");
const firebaseConfig = require("../config/firebase");
// console.log(firebaseConfig);

//Initialize a firebase application
initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

const { sendMail } = require("../utils/genUtils");

//------------ User Model ------------//
const User = require("../models/User");

//------------ Register Handle ------------//
exports.addCategories = async (req, res) => {
  console.log("hello");
  try {
    const dateTime = giveCurrentDateTime();
    console.log(req.file);
    const name = req.body.name;

    const storageRef = ref(
      storage,
      `files/${req.file.originalname + "       " + dateTime}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");

    const newCategory = new Category({
      name: name,
      image: downloadURL,
    });

    newCategory.save().then((user) => {
      // res.send({
      //   message: "file uploaded to firebase storage",
      //   name: req.file.originalname,
      //   type: req.file.mimetype,
      //   downloadURL: downloadURL,
      // });
      res.redirect("/admin/addCategories");
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

//------------ Register Handle ------------//
exports.addProducts = async (req, res) => {
  try {
    const dateTime = giveCurrentDateTime();
    console.log(req.file);
    console.log(req.body);
    const name = req.body.name;
    const categoryId = req.body.categoryId;
    const countInStock = req.body.countInStock;
    const description = req.body.description;
    const price = req.body.price;

    const storageRef = ref(
      storage,
      `files/${req.file.originalname + "       " + dateTime}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");

    const newProduct = new Product({
      name,
      featuredImage: downloadURL,
      categoryId,
      countInStock,
      description,
      price,
    });

    newProduct.save().then((p) => {
      //   res.send({
      //     message: "file uploaded to firebase storage",
      //     name: req.file.originalname,
      //     type: req.file.mimetype,
      //     downloadURL: downloadURL,
      //   });
      res.redirect("/admin/addProducts");
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};
