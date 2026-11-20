const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

const checkAvailability = async (req, res) => {
  const { listingId } = req.params;
  const { checkIn, checkOut } = req.body;

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return res.status(400).json({
      success: false,
      message: "Check-out date must be after check-in date.",
    });
  }

  const isAvailable = await Booking.findOne({
    listing: listingId,
    status: { $ne: "cancelled" },
    checkIn: { $lt: end },
    checkOut: { $gt: start },
  });

  if (isAvailable) {
    return res.status(409).json({
      success: false,
      message: "Listing is Currently Unavailable",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Listing is available",
  });
};

const createBooking = async (req, res) => {
  const { listingId } = req.params;
  const { checkIn, checkOut } = req.body;
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    req.flash("error", "Check-out date must be after check-in date.");
    return res.redirect(`/listings/${listingId}`);
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  const isAvailable = await Booking.findOne({
    listing: listingId,
    status: { $ne: "cancelled" },
    checkIn: { $lt: end },
    checkOut: { $gt: start },
  });
  if (isAvailable) {
    req.flash("error", "Listing is currently unavailable for those dates.");
    return res.redirect(`/listings/${listingId}`);
  }

  const totalNights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  await Booking.create({
    user: req.user._id,
    listing: listingId,
    checkIn: start,
    checkOut: end,
    totalPrice: totalNights * listing.price,
  });

  req.flash("success", "Booking confirmed.");
  return res.redirect(`/listings/${listingId}`);
};

module.exports = { checkAvailability, createBooking };
