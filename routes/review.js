const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsyc =  require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const review = require("../models/review.js");


const reviewController = require("../controllers/reviews.js");



//Post route
router.post("/",isLoggedIn,validateReview,
  wrapAsyc(reviewController.createReview)
);

//Delete review route
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsyc(reviewController.deleteReviews));

module.exports = router;
// export default router;