const express = require("express");
const router = express.Router({ mergeParams: true});
const User =  require("../models/user");
const wrapAsyc = require("../utils/wrapAsyc");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userCotroller = require("../controllers/users.js");
const Listing = require("../models/listing");
const Reservation = require("../models/reservation");
const { isLoggedIn } = require("../middleware");


router.route("/signup")
.get( userCotroller.renderSingupForm, )

.post( wrapAsyc(userCotroller.signup));


router.route("/login")
.get( userCotroller.rederLoginForm )
.post(
   
   saveRedirectUrl,
    passport.authenticate('local', 
    { failureRedirect: "/login", 
        failureFlash: true,
     }) ,
      userCotroller.login
     );


router.get("/profile",
   userCotroller.UserProfile );



router.get("/logout", userCotroller.logout);

module.exports = router;
