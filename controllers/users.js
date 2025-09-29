const User = require("../models/user");
const Listing = require('../models/listing');
const Reservation = require("../models/reservation");
module.exports.renderSingupForm = (req, res) =>{
    res.render("users/singup.ejs");
}

module.exports.signup = async(req, res) =>{
    try {
      
    let {username, email, password,} = req.body;
    const newUser =  new User({email, username});
    let registerUser =   await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser , (err) =>{
        if(err) {
            return next(err);
        }
        req.flash("success" , "Welcome to  Home page");
       res.redirect("/listings");
    })
   
    }catch(e){
       req.flash("error", e.message) ;
       res.redirect("/signup");
    }
   

};

module.exports.rederLoginForm = (req, res) =>{
    res.render("users/login.ejs");
};

module.exports.login =  async(req, res) =>{
        req.flash("success","Welcome to My WebSite!");
      res.redirect(res.locals.redirectUrl || "/listings" );

};


module.exports.logout =  (req, res) =>{
    req.logout((err) =>{
       if(err) {
         return next(err);
       }
       req.flash("success", "you are logged out!");
       res.redirect("/listings");
    })

};

module.exports.showProfile = async (req, res) => {
  if (!req.user) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }

  const myReservations = await Reservation.find({ user: req.user._id }).populate("listing");
  res.render("profile", { user: req.user, myReservations });
};


module.exports.UserProfile = async (req, res) => {
  if (!req.user) {
    req.flash("error", "Please login first!");
    return res.redirect("/login");
  }

  const myListings = await Listing.find({ owner: req.user._id });
  const myReservations = await Reservation.find({ user: req.user._id }).populate("listing");

  res.render("users/profile", {
    user: req.user,
    myListings,
    myReservations,
    currUser: req.user,
  });
}