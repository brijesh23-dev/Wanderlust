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

  const wishlist = await Wishlist.findOne({ user: userId });
  if (wishlist && wishlist.listings.some((id) => id.equals(listindId))) {
    await Wishlist.updateOne(
      { user: userId },
      { $pull: { listings: listindId } },
    );
    res.json({ action: "added" }, listindId);
  }
  await Wishlist.findOneAndUpdate(
    { user: userId },
    { $addToSet: { listings: listindId } },
    { new: true, upsert: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    wishlist,
  });
};

module.exports = { addToWishlist };
