const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const Product = require("../models/Product");

router.get("/", (req, res) => {
  let userName = null;
  if(req.user)userName = req.user.name;
  res.render("home", {userName : userName});
});

router.get("/category/:category/", async (req, res) => {
  let id = null;
  if (req.user) id = req.user._id;
  const categoryName = req.params.category; //payal
  const category = await Category.findOne({ name: "Pendants" });
  const products = await Product.find({ categoryId: category._id });
  console.log({ products });
  // res.send(products);
  res.render("category", { id: id, products: products });
});

router.get("/user/addToWishlist/:productId/", async (req, res) => {
  const productId = req.params.productId;
  console.log(productId)
  let user = null;
  if (req.user) user = req.user;
  console.log({user});
  user.wishlist.push(productId);
  await user.save();
  res.redirect('/');
//   .then((user, err)=>{
//     if(err)res.send(err)
//     else res.send("happy happy happy");
//   });

//   User.updateOne({ id }, update).then((err, result) => {
//     if (err) throw err;

//     console.log(`${result.modifiedCount} document updated`);
//   });
  
});

router.get('/product/:productId', async (req, res)=>{
  res.render('product');
})

module.exports = router;
