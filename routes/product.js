const mongoose = require("mongoose");
const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { isLoggedIn, isOwner, validateproduct, isAdmin } = require("../middleware.js");
const { index, showproduct, renderNewForm, createproduct, renderEditForm, editproduct, destroyproduct } = require("../controllers/product.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});




router.route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn, upload.single("product[image]"), validateproduct, wrapAsync(createproduct));


router.get("/new", isLoggedIn, isAdmin, wrapAsync(renderNewForm));

router.route("/:id")
    .get(wrapAsync(showproduct))
    .put(isLoggedIn, isAdmin, upload.single("product[image]"), wrapAsync(editproduct))
    .delete(isLoggedIn, isAdmin, wrapAsync(destroyproduct));




router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));


module.exports = router;


