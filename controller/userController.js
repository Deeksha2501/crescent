require("dotenv").config();
const { initializeApp } = require("firebase/app");
const multer = require("multer");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const User = require("../models/User");
const Cart = require("../models/Cart");

const firebaseConfig = require("../config/firebase");

//Initialize a firebase application
initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

exports.getUserProfile = (req, res) => {
  try {
    let user = req.user;
    let userId = req.user._id;
    res.render("profile", { user: user });
  } catch (err) {
    console.log({ err });
    res.redirect("/auth/login");
  }
};

exports.updateHandle = (req, res) => {
  try {
    const user = req.user;
    user.name = req.body.name;
    user.contactNumber = req.body.contact;

    user.save().then((user) => {
      if (req.body.isMerchant === "on") {
        this.switchToMerchantProfile(req, res);
      } else res.redirect("/user/profile#EditProfile");
    });
  } catch (err) {
    console.log({ err });
    req.flash("error_msg", "Something went wrong! Please login again");
    res.redirect("/auth/login");
  }
};

exports.switchToMerchantProfile = async (req, res) => {
  try {
    const file = req.file;
    const user = req.user;
    const dateTime = giveCurrentDateTime();

    user.isMerchant = true;
    user.businessOwnerName = req.body.businessOwnerName;
    user.gstNumber = req.body.gst;
    user.isVerified = false;

    const storageRef = ref(
      storage,
      `files/${file.originalname + "       " + dateTime}`
    );

    const metadata = {
      contentType: file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);
    user.panCardDoc = downloadURL;

    user.save().then((user) => {
      res.redirect("/profile#EditProfile");
    });
  } catch (err) {
    console.log({ err });
    req.flash("error_msg", "Something went wrong! Please login again");
    res.redirect("/auth/login");
  }
};

exports.addToCart = async (req, res) => {
  const productId = req.params.productId;
  console.log(productId);
  try {
    let userId = req.user._id;
    Cart.findOneAndUpdate(
      { userId, "products.productId": productId },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    )
      .then((userCart) => {
        if (userCart) {
          console.log("Updated document:", userCart);
        } else {
          return Cart.findOneAndUpdate(
            { userId },
            { $addToSet: { products: { productId: productId, quantity: 1 } } },
            { new: true, upsert: true }
          );
        }
      })
      .then((newUserCart) => {
        console.log("Updated or created document:", newUserCart);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log({ err });
    // res.redirect()
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const {
      params: { productId },
      user,
    } = req;
    console.log({ user });

    user.wishlist.push(productId);
    await user.save();

    res.redirect("/");
  } catch (err) {
    console.log(err);
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
