const express = require("express");
const router = express.Router();
const multer = require("multer");

const Category = require("../models/Category");

//------------ Importing Controllers ------------//
const adminController = require("../controller/adminController");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/addCategories", (req, res) => {
  let userName = null;
  if (req.user) userName = req.user.name;
  res.render("addCategories" , {userName : userName});
});

router.get("/addProducts", async (req, res) => {
  let userName = null;
  if (req.user) userName = req.user.name;
  var categories = await Category.find();
  categories = categories.map((c) => {
    return { _id: c._id, categoryName: c.categoryName };
  });
  console.log({ categories });
  res.render("addProducts", {
    userName: userName,
    categories: categories,
  });
});

//------------ Adding Category Handle ------------//
router.post(
  "/addCategories",
  upload.single("file"),
  adminController.addCategories
);

router.post("/addProducts", upload.single("file"), adminController.addProducts);

module.exports = router;
