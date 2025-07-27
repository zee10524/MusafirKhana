const Listing = require("../models/listing")

// In controllers/listing.js

module.exports.index = async (req, res) => {
    // Check if a search query 'q' exists
    if (req.query.q) {
        const query = req.query.q;
        // If it exists, perform a text search
        const allListings = await Listing.find({ $text: { $search: query } });

        // Add a flash message if no results are found
        if (allListings.length === 0) {
            req.flash("error", "No listings found for your search. Try another destination!");
            return res.redirect("/listings");
        }

        // Render the index page with the search results
        res.render("listings/index", { allListings });

    } else {
        // If no search query, fetch all listings as before
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    }
};

module.exports.renderNewForm =(req, res) => {

    res.render("listings/new"); // ✅ fixed path
}

module.exports.showListing =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (listing) {
        res.render("listings/show", { listing }); // ✅ fixed path
    } else {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
   
}

module.exports.createListing =async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"..",filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
  
   req.flash("success", "New listing created successfully!");
   res.redirect("/listings");

}

module.exports.renderEditForm =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_100");
    res.render("listings/edit", { listing , originalImageUrl}); // ✅ fixed path
}

module.exports.updateListing =async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    let url = req.file.path;
    let filename = req.file.filename;

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
   
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing =async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}