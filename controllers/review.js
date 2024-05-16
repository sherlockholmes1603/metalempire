const product = require("../models/product.js");
const Review = require("../models/review.js");


module.exports.giveReview = async (req, res) => {
    let product = await product.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    product.reviews.push(newReview);

    await newReview.save();
    await product.save();

    console.log("new Review saved");
    res.redirect(`/products/${product._id}`);
};


module.exports.destroyReview = async (req, res) => {
    let {id, rid} = req.params;
  
    await product.findByIdAndUpdate(id, {$pull: {reviews: rid}});
  
    await Review.findByIdAndDelete(rid);
  
    res.redirect(`/products/${id}`);
};


