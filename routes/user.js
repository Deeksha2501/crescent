const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

//------------ Importing Controllers ------------//
const userController = require("../controller/userController");

router.post("/updateProfile", upload.single("file"), userController.updateHandle);

router.get("/addToCart/:productId/", userController.addToCart);

router.get("/addToWishlist/:productId/", userController.addToWishlist);

router.get("/profile" , userController.getUserProfile)

module.exports = router;