import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}


console.log(process.env.secret)


// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");  
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js")
// const session = require("express-session");
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");


//gpt
import express from "express";
import mongoose from "mongoose";
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";

const app = express();


// const listingsRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");


//gpt
import listingsRouter from "./routes/listing.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/user.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const MONGO_URL = "mongodb://127.0.0.1:27017/Wardlast";

main()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("public"));


const sessionOption = {
  secret: "mysupersecretecode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    exprires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    
  }
};


// Home route
app.get("/", (req, res) => {
  res.send("Welcome to Home Page"); 
});


app.use(session(sessionOption));
app.use(flash());


//password implement
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


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
  let { statusCode = 500, message= "went wr" } = err;
  res.status(statusCode).render("error.ejs", {message});
  


   
});



app.listen(8080, () => {
  console.log("Server connected on port 8080");
});


//gpt

// import dotenv from "dotenv";
// if (process.env.NODE_ENV !== "production") {
//   dotenv.config();
// }

// import express from "express";
// import mongoose from "mongoose";
// import path from "path";
// import methodOverride from "method-override";
// import ejsMate from "ejs-mate";
// import session from "express-session";
// import flash from "connect-flash";
// import passport from "passport";
// import LocalStrategy from "passport-local";

// import ExpressError from "./utils/ExpressError.js";
// import User from "./models/user.js";

// import listingsRouter from "./routes/listing.js";
// import reviewRouter from "./routes/review.js";
// import userRouter from "./routes/user.js";

// import { fileURLToPath } from "url";

// // __dirname setup (ESM me default nahi hota)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Database connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/Wardlast";

// main()
//   .then(() => console.log("✅ Database connected"))
//   .catch((err) => console.log("❌ DB Error:", err));

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// // View engine setup
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.engine("ejs", ejsMate);

// // Middlewares
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));

// // Session config
// const sessionOption = {
//   secret: "mysupersecretecode",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//   },
// };

// app.use(session(sessionOption));
// app.use(flash());

// // Passport config
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // Flash + current user locals
// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currUser = req.user;
//   next();
// });

// // Home route
// app.get("/", (req, res) => {
//   res.send("Welcome to Home Page");
// });

// // Routers
// app.use("/listings", listingsRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// app.use("/", userRouter);

// // 404 handler
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

// // Error handler
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message = "Something went wrong" } = err;
//   res.status(statusCode).render("error.ejs", { message });
// });

// // Server start
// app.listen(8080, () => {
//   console.log("🚀 Server connected on port 8080");
// });
