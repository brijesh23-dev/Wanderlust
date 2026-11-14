
const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },

  checkIn: {
    type: Date,
    required: true,
  },

  checkOut: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.checkIn;
      },
      message: "Check-out date must be after check-in date.",
    },
  },

  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
