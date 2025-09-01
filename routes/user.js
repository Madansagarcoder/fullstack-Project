const express = require("express");
const router = express.Router({ mergeParams: true});
const User =  require("../models/user");
const wrapAsyc = require("../utils/wrapAsyc");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userCotroller = require("../controllers/users.js");

router.route("/singup")
.get( userCotroller.renderSingupForm)
.post( wrapAsyc(userCotroller.singup));


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


router.get("/logout", userCotroller.logout);

module.exports = router;
// export default router;