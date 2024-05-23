const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const { signup, renderSignup, login, renderLogin, logout, cartItems, addItemsToCart } = require("../controllers/users.js");



router.route("/signup")
.get(renderSignup)
.post(wrapAsync( signup ));


router.route("/login")
.get(renderLogin)
.post(  saveRedirectUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true}), 
        login );

router.get("/logout", logout);

router.route("/cart")
.get(isLoggedIn("Please login to add items to cart"), cartItems)

router.post("/cart/:id", isLoggedIn("Please login to add items to cart"), wrapAsync(addItemsToCart));



module.exports = router;