const mongoose = require("mongoose");
const initData= require("./data.js");
const Listing= require("../models/listing.js");

require('dotenv').config()



const MONGO_URL=process.env.MONGO_URI;
async function main() {
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected to DB");
    
})

const initDB= async()=>{

    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
    
}

initDB();

