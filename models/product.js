const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

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
  filter: {
    type: String,
    required: true,
    enum: [
      "Statues",
      "WallArts",
      "CrytalGlass",
      "Utensils",
      "AntiqueItems",
      "DecorativeItems",
      "Crockery",
      "RelegiousUtensils",
      "Diya"
    ]
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ]
});

productSchema.post("findOneAndDelete", async (product) => {
  if (product) {
    await Review.deleteMany({ _id: { $in: product.reviews } });
  }
});

module.exports = mongoose.model("Product", productSchema);
