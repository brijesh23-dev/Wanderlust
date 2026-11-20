const Booking = require("../models/booking.js");

const checkAvailability = async (req, res) => {
  const { listingId } = req.params;
  const { checkIn, checkOut } = req.body;
  const isAvailable = await Booking.findOne({
    listing: listingId,
    status: { $ne: "cancelled" },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  });

  if (!isAvailable) {
    res.stats(409).json({
      success: false,
      message: "Listing is Currently Unavailable",
    });
  }

  res.status(200).json({
    success: true,
    message: "Listing is available",
  });
};

module.exports = { checkAvailability };
