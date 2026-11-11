const Wishlist = require("../models/wishlist");
const Listing = require("../models/listing");
const { default: mongoose } = require("mongoose");

const addToWishlist = async (req, res) => {
  const { listindId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(listindId)) {
    throw new Error(400, "Invalid listing ID");
  }

  const listing = await Listing.findById(listindId);
  if (!listing) {
    throw new Error(400, "Listing not foudn");
  }

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $addToSet: { listings: listindId } },
    { new: true, upsert: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    wishlist,
  });
};

const removeFromWishlist = async (req, res) => {
  const { listindId } = req.params;
  const userId = req.user._id;
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $pull: { listings: listindId } },
    { new: true },
  );

  res.status(200).json({
    success: true,
    wishlist,
  });
};

const getWishlist = async (req, res) => {
  const userId = req.user._id;
  const wishlist = await Wishlist.findOne({
    user: userId,
  }).populate("listings");
  res.json({
    listings: wishlist ? wishlist.listings : [],
  });
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
