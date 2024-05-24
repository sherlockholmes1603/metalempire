const product = require("./models/product.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { productSchema, reviewSchema } = require("./schema.js");
const user = require("./models/user.js");

module.exports.isLoggedIn = (message) => (req, res, next) => {
  console.log(req);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", message || "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  next();
};

module.exports.isAdmin = async (req, res, next) => {
  const curUser = await user.findById(res.locals.user._id);
  if (curUser.isAdmin) {
    return next();
  }
  req.flash("error", "You must be logged in as an admin to edit");
  return res.redirect(`/products`);
};

module.exports.validateproduct = (req, res, next) => {
  console.dir(req.dir);
  let { error } = productSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, rid } = req.params;
  let review = await Review.findById(rid);
  if (!review.author._id.equals(res.locals.user._id)) {
    req.flash("error", "You are not the author of the review");
    return res.redirect(`/products/${id}`);
  }
  next();
};
