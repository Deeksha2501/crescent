// add products
// add categories

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
  try {
    const dateTime = giveCurrentDateTime();
    console.log(req.file);
    const categoryName = req.body.categoryName;

    const storageRef = ref(
      storage,
      `files/${req.file.originalname + "       " + dateTime}`
    );

    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");

    const newCategory = new Category({
      categoryName: categoryName,
      image: downloadURL,
    });

    newCategory.save().then((user) => {
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
    const productName = req.body.productName;
    const price = req.body.price;
    const discountPrice = req.body.discountPrice;
    const countInStock = req.body.countInStock;
    const weight = req.body.weight;
    const length = req.body.length;
    const metalDescription = req.body.metalDescription;
    const purity = req.body.purity;
    const warranty = req.body.warranty;
    const stones = req.body.stones;
    const description = req.body.description;
    const categoryId = req.body.categoryId;

    const storageRef = ref(
      storage,
      `files/${req.file.originalname + " " + dateTime}`
    );

    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");

    const newProduct = new Product({
      productName,
      price,
      discountPrice,
      countInStock,
      weight,
      length,
      metalDescription,
      purity,
      warranty,
      stones,
      categoryId,
      description,
      featuredImage: downloadURL,
    });

    newProduct.save().then((p) => {
      req.flash(
        "success_msg",
        "Product Added Successfully"
      );
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
