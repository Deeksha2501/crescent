const express = require("express");
const router = express.Router();
const multer = require("multer");
// const {multerUpload} = require('../utils/multer')

const Category = require("../models/Category");

//------------ Importing Controllers ------------//
const adminController = require("../controller/adminController");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/addCategories", (req, res) => {
  res.render("addCategories");
});

router.get("/addProducts", async (req, res) => {
    var categories = await Category.find();
    categories = categories.map((c) => {
      return { _id: c._id, name: c.name };
    });
    console.log({categories});
    res.render("addProducts", {
      categories: categories,
    });
  });

//------------ Ading Category Handle ------------//
router.post("/addCategories", upload.single("file") , adminController.addCategories);

router.post("/addProducts", upload.single("file") , adminController.addProducts)

// //------------ Forgot Password Route ------------//
// router.get("/forgot", (req, res) => res.render("forgot"));

// //------------ Reset Password Route ------------//
// router.get("/reset/:id", (req, res) => {
//   // console.log(id)
//   res.render("reset", { id: req.params.id });
// });

// //------------ Register Route ------------//
// // router.get('/register',  async (req, res) => {
// //     var insts = await Inst.find();
// //     insts = insts.map(i => {return {_id: i._id, name: i.name}})
// //     console.log(insts)
// //     res.render('register' , {
// //         insts : insts
// //     }
// // )});

// //------------ Register POST Handle ------------//
// router.post("/register", authController.registerHandle);

// //------------ Email ACTIVATE Handle ------------//
// router.get("/activate/:token", authController.activateHandle);

// //------------ Forgot Password Handle ------------//
// router.post("/forgot", authController.forgotPassword);

// //------------ Reset Password Handle ------------//
// router.post("/reset/:id", authController.resetPassword);

// //------------ Reset Password Handle ------------//
// router.get("/forgot/:token", authController.gotoReset);

// //------------ Login POST Handle ------------//
// router.post("/login", authController.loginHandle);

// //------------ Logout GET Handle ------------//
// router.get("/logout", authController.logoutHandle);

module.exports = router;
