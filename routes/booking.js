const express = require("express");
const bookingController = require("../controller/booking.js");
const { isLoggedIn } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router();

router.post(
  "/:listingId/availability",
  isLoggedIn,
  wrapAsync(bookingController.checkAvailability),
);

router.post(
  "/:listingId",
  isLoggedIn,
  wrapAsync(bookingController.createBooking),
);

module.exports = router;
