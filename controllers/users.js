const User = require("../models/user");

module.exports.renderSingupForm = (req, res) =>{
    res.render("users/singup.ejs");
}

module.exports.singup = async(req, res) =>{
    try {
    let {username, email, password} = req.body;
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
       res.redirect("/singup");
    }
   

};

module.exports.rederLoginForm = (req, res) =>{
    res.render("users/login.ejs");
};

module.exports.login =  async(req, res) =>{
        req.flash("success","Welcome to My WebSite!");
        // let redirectUrl = res.locals.redirectUrl || "/listings"
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