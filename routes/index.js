const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  // let userName = null;
  // if (req.user) userName = req.user.name;
  // res.render("home", { userName: userName });
  try {
    let name = null;
    if (req.user) name = req.user.name;
    // let products = await getProductsDataWithWishlistStatus(
    //   req.user,
    //   "Pendants"
    // );
    let products = (await Product.find().sort({createdAt:1}).limit(10)).reverse();
    console.log({ products });
    res.render("home", { userName: name, products: products });
  } catch (err) {
    console.log({ err });
  }
});

router.get("/category/:category/", async (req, res) => {
  try {
    let name = null;
    if (req.user) name = req.user.name;
    let products = await getProductsDataWithWishlistStatus(
      req.user,
      req.params.category
    );
    console.log({ products });
    res.render("category", { userName: name, products: products });
  } catch (err) {
    console.log({ err });
  }
});

async function getProductsDataWithWishlistStatus(user, categoryName) {
  try {
    console.log({ categoryName });
    const category = await Category.findOne({ categoryName: categoryName });

    const products = await Product.find({ categoryId: category._id });

    if (!user) return products;

    const userWithWishlist = await user.populate({
      path: "wishlist",
      select: "_id",
      model: "Product",
    });

    const userProducts = userWithWishlist.wishlist;

    return products.map((product) => ({
      ...product.toObject(),
      isWishlisted: userProducts.some((userProduct) =>
        userProduct._id.equals(product._id)
      ),
    }));
  } catch (error) {
    console.error("Error fetching products with wishlist status:", error);
    throw error;
  }
}

router.get("/product/:productId", async (req, res) => {
  try {
    let userName = null;
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if(!res.user){
      res.render("product", {
        product: product,
        userName: userName,
      });
    }else{ userName = req.user.name;
    const userWithWishlist = await req.user.populate({
      path: "wishlist",
      select: "_id",
      model: "Product",
    });

    const userProducts = userWithWishlist.wishlist;
    product.isWishlisted = userProducts.some((userProduct) =>
      userProduct._id.equals(product._id)
    );
    res.render("product", {
      product: product,
      userName: userName,
    });
  }
  } catch (err) {
    console.log({ err });
  }
});

module.exports = router;
