const express = require("express");
const router = express.Router();
const wrapAsyc =  require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner, validateListing} = require("../middleware.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//gpt
// import express from "express";
// const router = express.Router();

// import wrapAsync from "../utils/wrapAsyc.js";
// import Listing from "../models/listing.js";
// import { isLoggedIn, isOwner, validateListing } from "../middleware.js";

// import multer from "multer";
// import { storage } from "../cloudConfig.js";
// const upload = multer({ storage });




const listingCollroller = require("../controllers/listings.js")
 
// index route , create
router.route("/")
.get(wrapAsyc(listingCollroller.index))
.post(
  isLoggedIn,
  
  upload.single('listing[image]'),
  
  validateListing,

   wrapAsyc(listingCollroller.createListing)
);


 
//new route
router.get("/new",isLoggedIn,listingCollroller.renderNewForm);

//show , update route, delete route
router.route("/:id")
.get( wrapAsyc(listingCollroller.showListing))
.put( 
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsyc(listingCollroller.updateListing))
  .delete(
  isLoggedIn,
  isOwner,
  wrapAsyc(listingCollroller.DeleteListing))



//Edit route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsyc(listingCollroller.renderEditForm));







 module.exports = router;
// export default router;