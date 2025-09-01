const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id.trim());
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview._id);
    
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!")
    res.redirect(`/listings/${listing._id}`);
  }


  module.exports.deleteReviews = async (req, res) => {
      let { id, reviewId } = req.params;
      
    
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", "New Review Delete!")
      res.redirect(`/listings/${id}`);
  };