
const mongoose = require("mongoose");
const Review = require("./review");  
const { ref } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({

  //gptnech
  
    
   location: String,
   price: Number,

    title: {
        type: String,
        required: true,   
    },
    description: String,

    
     image: {
            url: String,
            filename: String,
        },
  


    price: Number,
    location: String,   
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
   
    
   
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
     //gpt
    favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  hostBio: { type: String, default: "" },
 


}, { timestamps: true });

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
