const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });  
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs"); 
}

module.exports.showListing = async (req, res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({path: "reviews",
    populate: {
      path: "author",
    },
   })

  .populate("owner");
  if(!listing) {
        req.flash("error", "Listing  you requested for does not exits");
        return  res.redirect("/listings");
  }
  console.log(listing)
  res.render("listings/show.ejs", { listing });
  
};



module.exports.createListing = async (req, res, next) => {

    let url = req.file.path;
    let filename = req.file.filename;
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image = {url, filename};

      await newListing.save();
    
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");

    
  
  };




module.exports. renderEditForm = async (req, res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
   if(!listing) {
        req.flash("error", "Listing  you requested for does not exits")
        return   res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl =  originalImageUrl.replace("/upload", "/upload/h_75,w_130");
  res.render("listings/edit.ejs", {listing, originalImageUrl});
} 


module.exports.updateListing = async (req, res) =>{
  let {id} = req.params;
  let listing =   await Listing.findByIdAndUpdate(id, { ...req.body.listing});
 

  if(typeof req.file !== "undefined"){
      let url =  req.file.path;
      let filename = req.file.filename;
      listing.image = {url, filename};
     await listing.save();

  }
  
  req.flash("success", "New Listing Update!")
  res.redirect(`/listings/${id}`);
  

};


module.exports.DeleteListing =  async (req, res) =>{
   let {id} = req.params;
   let deleteListing = await Listing.findByIdAndDelete(id);
   console.log(deleteListing);
   req.flash("success", "New Listing Delete!")
   res.redirect("/listings");
};



module.exports.searchA =  async (req, res) => {
  let query = req.query.q || "";
  let searchFilter = {
    $or: [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
    ],
  };

  if (!isNaN(query)) {
    searchFilter.$or.push({ price: Number(query) });
  }

  
  if (query.includes("-")) {
    let [min, max] = query.split("-").map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      searchFilter.$or.push({ price: { $gte: min, $lte: max } });
    }
  }

  const listings = await Listing.find(searchFilter);
  res.render("listings/index", { allListings: listings });
}

module.exports.faverateHeart = async (req, res) => {
  try {
    if (!req.user) {
    
      return res.status(401).json({ error: "Login required" });
    }
    const listingId = req.params.id;
    const userId = req.user._id;

   
    const already = await Listing.exists({ _id: listingId, favorites: userId });

    let listing;
    if (already) {
      // remove favorite
      listing = await Listing.findByIdAndUpdate(
        listingId,
        { $pull: { favorites: userId } },
        { new: true }
      );
      return res.json({ favorited: false, count: listing.favorites.length });
    } else {
      // add favorite
      listing = await Listing.findByIdAndUpdate(
        listingId,
        { $addToSet: { favorites: userId } },
        { new: true }
      );
      return res.json({ favorited: true, count: listing.favorites.length });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

//updateBai
module.exports.updateBai = async (req, res) => {
  try {
    const { id } = req.params;
    const { hostBio } = req.body;

    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "You are not authorized to add bio.");
      return res.redirect(`/listings/${id}`);
    }

    listing.hostBio = hostBio;
    await listing.save();

    req.flash("success", "Bio added successfully!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong!");
    res.redirect("back");
  }
}