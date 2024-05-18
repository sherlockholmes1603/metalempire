const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const productSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

productSchema.post("findOneAndDelete", async (product) => {
  if (product) {
    await Review.deleteMany({ _id: { $in: product.reviews } });
  }
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
