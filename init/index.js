const mongoose = require("mongoose");
const initData= require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URl = 'mongodb://127.0.0.1:27017/Wardlast';

main()
.then(() => {
    console.log("data Base connected")
})
.catch ((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URl);
}

const initDB = async () => {
   await  Listing.deleteMany({});
   initData.data =  initData.data.map((obj) => ({
     ...obj,
      owner: "68b04a7a66c160520e7a2105",
     }));
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
}

initDB();