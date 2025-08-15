const mongoose =require("mongoose");
const initdata=require("./data.js");
const Listing= require("../models/listing.js");



main()
.then((result)=>{
    console.log("connection established");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/HOURLY");
}


   const initDB = async () => {
  try {
    console.log("🟡 Deleting old listings...");
    await Listing.deleteMany({});
    console.log("🟢 Inserting new data...");
    const result=await Listing.insertMany(initdata.data);
    console.log("✅ All data has been successfully saved to the database.");
    console.log(result);
  } catch (error) {
    console.error("❌ Error saving data to the database:", error);
  }
};

initDB();