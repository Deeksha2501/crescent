const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const Product = require("../models/Product");

router.get("/", (req, res) => {
  let userName = null;
  if (req.user) userName = req.user.name;
  res.render("home", { userName: userName });
});

router.get("/category/:category/", async (req, res) => {
  try {
    let userProducts = await req.user.populate({
      path: "wishlist",
      select: "_id",
      model: "Product",
    });
    userProducts = userProducts.wishlist;
    console.log({ userProducts });
  } catch (err) {
    console.log({ err });
  }

  let userName = null;
  if (req.user) userName = req.user.name;
  const categoryName = req.params.category; //payal
  const category = await Category.findOne({ name: "Pendants" });
  const products = await Product.find({ categoryId: category._id });
  console.log({ products });
  // res.send(products);
  res.render("category", { userName: userName, products: products });
});

async function getProductsDataWithWishlistStatus(userId) {
  const products = await fetchProductsFromDatabase();
  const wishlistStatus = await computeWishlistStatus(userId, products);
  return products.map(product => ({
    ...product,
    isWishlisted: wishlistStatus.includes(product._id), 
  }));
}


router.get("/product/:productId", async (req, res) => {
  let userName = null;
  if (req.user) userName = req.user.name;
  res.render("product", { userName: userName });
});

module.exports = router;
