const express = require("express");
const wishlistController = require("../controller/wishlist");
const router = express.Router();

router.post("/:listingId", wishlistController.addToWishlist);

module.exports = router;