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

exports.getUserWishlist = async (req, res) => {
  try {
    const userWithWishlist = await req.user.populate({
      path: "wishlist",
      model: "Product",
    });

    const userProducts = userWithWishlist.wishlist;
    res.send(userProducts);
  } catch (err) {
    console.log({ err });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartProducts = await Cart.findOne({ userId: userId }).populate({
      path: "products.productId",
      model: "Product",
    });
    res.send(cartProducts);
  } catch (err) {
    console.log({ err });
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
  const quantity = req.body.quantity;
  console.log(req.body);
  console.log(productId);
  try {
    let userId = req.user._id;
    Cart.findOneAndUpdate(
      { userId, "products.productId": productId },
      { $inc: { "products.$.quantity": quantity } },
      { new: true }
    )
      .then((userCart) => {
        if (userCart) {
          console.log("Updated document:", userCart);
        } else {
          return Cart.findOneAndUpdate(
            { userId },
            {
              $addToSet: {
                products: { productId: productId, quantity: quantity },
              },
            },
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
    res.redirect(`/product/${productId}`);
  }
};

exports.moveToCart = async (req, res) => {
  const productId = req.params.productId;

  try {
    let userId = req.user._id;

    // Step 1: Remove the product from the wishlist
    const wishlist = req.user.wishlist; // Assuming wishlist is an array or object
    const updatedWishlist = removeProductFromWishlist(wishlist, productId);

    if (!updatedWishlist) {
      console.log("Product not found in the wishlist");
      return res
        .status(404)
        .json({ error: "Product not found in the wishlist" });
    }
    req.user.wishlist = updatedWishlist;
    await req.user.save();

    const userCart = await Cart.findOne({ userId: userId });
    console.log({ userCart });
    let productInCart;
    if (userCart)
      productInCart = userCart.products.find(
        (product) => product.productId.toString() == productId
      );
    console.log({ productInCart });
    if (!productInCart) {
      const updatedCart = await Cart.findOneAndUpdate(
        { userId },
        { $addToSet: { products: { productId: productId, quantity: 1 } } },
        { new: true, upsert: true }
      );

      console.log("Updated cart:", updatedCart);
    }

    res.send(true);
  } catch (error) {
    console.error("Error:", error);
    res.send(false);
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const {
      params: { productId },
      user,
    } = req;

    const isProductInWishlist = user.wishlist.includes(productId);
    let responseCode = "";

    if (isProductInWishlist) {
      // If the product is already in the wishlist, remove it
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId.toString()
      );
      responseCode = false;
    } else {
      // If the product is not in the wishlist, add it
      user.wishlist.push(productId);
      responseCode = true;
    }

    await user.save();
    res.send(responseCode);
  } catch (err) {
    console.log(err);
    res.send(undefined);
  }
};

exports.removeFromWishlist = async (req, res) => {
  const productId = req.params.productId;
  try {
    let userId = req.user._id;

    // Step 1: Remove the product from the wishlist
    const wishlist = req.user.wishlist; // Assuming wishlist is an array or object
    const updatedWishlist = removeProductFromWishlist(wishlist, productId);

    if (!updatedWishlist) {
      console.log("Product not found in the wishlist");
      return res
        .status(404)
        .json({ error: "Product not found in the wishlist" });
    }
    req.user.wishlist = updatedWishlist;
    await req.user.save();
    res.redirect("/user/wishlist");
  } catch (err) {
    console.log({ err });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const formData = req.body;
    console.log({ formData });

    Object.keys(formData).forEach(async (key) => {
      if (key.startsWith("quantity_")) {
        const productId = key.replace("quantity_", "");
        const quantity = formData[key];

        console.log(`Product ID: ${productId}, Quantity: ${quantity}`);

        await Cart.updateOne(
          { userId: req.user._id, "products.productId": productId },
          { $set: { "products.$.quantity": quantity } }
        ).then((cart) => {
          console.log({ cart });
        });
      }
    });
    res.send(true);
  } catch (err) {
    console.log({ err });
    res.send(false);
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

function removeProductFromWishlist(wishlist, productId) {
  console.log({ productId });
  console.log({ wishlist });
  const index = wishlist.findIndex((id) => id.toString() == productId);

  // If the product is found, remove it from the wishlist
  if (index !== -1) {
    wishlist.splice(index, 1);
    return wishlist; // Return the updated wishlist
  }
  return null;
}
