const Wishlist = require("../models/wishlist");
const Listing = require("../models/listing");
const { default: mongoose } = require("mongoose");

const addToWishlist = async (req, res) => {
  const { listingId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(listingId)) {
    throw new Error(400, "Invalid listing ID");
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new Error(400, "Listing not found");
  }

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $addToSet: { listings: listingId } },
    { new: true, upsert: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    wishlist,
  });
};

const removeFromWishlist = async (req, res) => {
  const { listingId } = req.params;
  const userId = req.user._id;
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { $pull: { listings: listingId } },
    { new: true },
  );

  res.status(200).json({
    success: true,
    wishlist,
  });
};

const fetchUserWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({
    user: userId,
  }).populate("listings");

  return wishlist ? wishlist.listings : [];
};

const getWishlist = async (req, res) => {
  const userId = req.user._id;
  const listings = await fetchUserWishlist(userId);
  res.json({
    success: true,
    listings,
  });
};

const renderWishlist = async (req, res) => {
  const userId = req.user._id;
  const listings = await fetchUserWishlist(userId);
  res.render("listings/wishlist", { listings });
};
module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  renderWishlist,
};
