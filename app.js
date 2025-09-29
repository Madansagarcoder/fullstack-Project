if (process.env.NODE_ENV != "production") {
 require('dotenv').config();
}

const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const path = require("path");  
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Listing = require("./models/listing");
const User = require("./models/user.js");
const Reservation = require("./models/reservation"); 

// Date
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
app.locals.dayjs = dayjs;


const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbURL = process.env.ATLAS_MONGO;

main()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("public"));

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
 
store.on("error", () =>{
  console.log("Error in Mongo session Strore", err)
})

const sessionOption = {
  store,
  secret:  process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    exprires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    
  }
};

app.use(session(sessionOption));
app.use(flash());

//password implement
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;   
  next();
});
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
  res.locals.currUser = req.user;  
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.get("/city/:city", async (req, res) => {
  const { city } = req.params;
  try {
    const listings = await Listing.find({
      location: { $regex: new RegExp(city, "i") }
    });

    res.render("listings/city", { city, listings });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
});


app.post("/reserve/:id", async (req, res) => {
  try {
    if (!req.user) {
      req.flash("error", "You must be logged in to make a reservation!");
      return res.redirect("/login");
    }

    const { checkin, checkout, guests } = req.body;
    const listing = await Listing.findById(req.params.id).populate("owner");

    if (!listing || !listing.owner) {
      req.flash("error", "Listing ya owner nahi mila!");
      return res.redirect("back");
    }

    const reservation = new Reservation({
      user: req.user._id,
      listing: listing._id,
      checkin,
      checkout,
      guests,
    });
    await reservation.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: listing.owner.email,
      subject: `New Reservation for ${listing.title}`,
      text: `
        New reservation request:

        Listing: ${listing.title}
        Check-in: ${checkin}
        Check-out: ${checkout}
        Guests: ${guests}

        🔹 Reserved by:
        Name: ${req.user.username}
        Email: ${req.user.email}
      `,
    };

    await transporter.sendMail(mailOptions);

    req.flash("success", "Reservation saved & email sent to owner!");
    res.redirect("/profile"); 
  } catch (err) {
    console.error("Reservation error:", err);
    req.flash("error", "Reservation failed!");
    res.redirect("back");
  }
});


app.delete('/reservations/:id', async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
   
    return res.status(200).json({ message: 'Reservation deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Cannot delete reservation' });
  }
});


app.post("/cancel-reservation/:id", async (req, res) => {
  try {
    if (!req.user) {
      req.flash("error", "You must be logged in to cancel!");
      return res.redirect("back");
    }

    const reservation = await Reservation.findById(req.params.id)
      .populate({ path: "listing", populate: { path: "owner" } });

    if (!reservation) {
      req.flash("error", "Reservation not found!");
      return res.redirect("back");
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      req.flash("error", "You cannot cancel someone else's reservation!");
      return res.redirect("back");
    }

    const { reason } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reservation.listing.owner.email, 
      subject: `Reservation Cancelled for ${reservation.listing.title}`,
      text: `
     Hello ${reservation.listing.owner.username},

     The following reservation has been cancelled:

     Listing: ${reservation.listing.title}
     Check-in: ${reservation.checkin}
     Check-out: ${reservation.checkout}
     Reason: ${reason}
     Cancelled by:
     Name: ${req.user.username}
     Email: ${req.user.email}
       `,
    };

    await transporter.sendMail(mailOptions);
    await Reservation.findByIdAndDelete(req.params.id);

    req.flash("success", "Reservation cancelled and email sent to listing owner!");
    res.redirect("back");
  } catch (err) {
    console.error("Cancel reservation error:", err);
    req.flash("error", "Failed to cancel reservation!");
    res.redirect("back");
  }
});

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
  next();
});

//listing.connect
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err ,req, res,  next ) =>{
  let { statusCode = 500, message= "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", {message});
  

});


app.listen(8080, () => {
  console.log("Server connected on port 8080");
});

