const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  checkin: Date,
  checkout: Date,
  guests: Number,
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);
