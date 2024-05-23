const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  cart: {
    quantity: {
      type: Number,
      default: 0
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product"
      }
    ]
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
