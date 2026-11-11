const express = require("express");
const wishlistController = require("../controller/wishlist");
const router = express.Router();
const { isLoggedIn } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.put(
  "/:listingId",
  isLoggedIn,
  wrapAsync(wishlistController.addToWishlist),
);
router.delete(
  "/:listingId",
  isLoggedIn,
  wrapAsync(wishlistController.removeFromWishlist),
);

router.get("/", isLoggedIn, wrapAsync(wishlistController.getWishlist));

module.exports = router;
