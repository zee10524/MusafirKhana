const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");

const listingSchema = new Schema({
    title: {
        type: String,
       
    },
    description: String,

    image: {
    url : String,
    filename: String,
   
    },
    
    price: {
        type: Number,
        required: true,
        min: 0
    },

    location: String,
    
    country: String,

    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
   if (listing) {
     await Review.deleteMany({ _id: { $in: listing.reviews } });
   }
});

listingSchema.index({ title: 'text', description: 'text', location: 'text', country: 'text' });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
