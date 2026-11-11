const mongoose = require("mongoose");
const { Schema } = mongoose;
const wishlistSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
