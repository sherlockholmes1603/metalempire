const mongoose = require("mongoose");
const express = require("express");
const product = require("../models/product.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const { giveReview, destroyReview } = require("../controllers/review.js");






router.post("/", isLoggedIn, validateReview, wrapAsync( giveReview ));

router.delete("/:rid", isLoggedIn, isReviewAuthor, wrapAsync(destroyReview));




module.exports = router;