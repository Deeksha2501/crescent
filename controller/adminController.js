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

//------------ Add Products Handle ------------//
exports.addProducts = async (req, res) => {
  try {
    const dateTime = giveCurrentDateTime();
    console.log(req.file);
    console.log(req.body);
    let {
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
      description,
      categoryId,
    } = req.body;

    discountPrice = 0;
    countInStock = 14;
    weight = 4; 
      length = 50;
      metalDescription = "Silver";
      purity = "925 Sterling Silver";
      warranty = "1 year Warranty";
      stones = "N/A";
      description = "The curb silver chain is your go to accessory for any look,dainty or bold. Taraash 925 sterling silver simple regular wear 10 inch curb chain for women.Silver finish easy to wear spring ring clasp in the chain.This distinctive curb chain has a straightforward design, so you can wear it alone or with your favourite pendant." ;


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
      req.flash("success_msg", "Product Added Successfully");
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
