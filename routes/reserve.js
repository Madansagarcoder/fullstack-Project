const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservation");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");  

// Reserve a listing
router.post("/:id", isLoggedIn, async (req, res) => {
   try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
         req.flash("error", "Listing not found!");
         return res.redirect("/listings");
      }

      const reservation = new Reservation({
         user: req.user._id,
         listing: listing._id,
         checkin: req.body.checkin,
         checkout: req.body.checkout,
         guests: req.body.guests
      });

      await reservation.save();
      req.flash("success", "Reservation successful!");
      res.redirect("/profile");
   } catch (err) {
      console.log(err);
      req.flash("error", "Something went wrong!");
      res.redirect("/listings");
   }
});

module.exports = router;
