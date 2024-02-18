const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

//------------ Importing Controllers ------------//
const userController = require("../controller/userController");

router.post("/updateProfile", upload.single("file"), userController.updateHandle);

router.post("/addToCart/:productId/", userController.addToCart);

router.get("/moveToCart/:productId/", userController.moveToCart);

router.get("/addToWishlist/:productId/", userController.addToWishlist);

router.get("/removeFromWishlist/:productId/", userController.removeFromWishlist);

router.get("/profile" , userController.getUserProfile);

router.get("/getWishlist" , userController.getUserWishlist);

router.get("/getCart" , userController.getUserCart);

router.post("/updateCart", userController.updateCart);

router.get('/wishlist', (req, res)=>{
    try{
        let user = req.user;
        let userName = user.name;
        res.render("wishlist" , {userName : userName})
    }catch(err){
console.log({err});
    }
})

router.get('/cart', (req, res)=>{
    try{
        let user = req.user;
        let userName = user.name;
        res.render("cart" , {userName : userName , user : user})
    }catch(err){
console.log({err});
    }
})

module.exports = router;