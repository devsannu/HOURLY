const mongoose=require("mongoose");
const Schema= mongoose.Schema;

const listingSchema =new Schema(
    {
//   _id: ObjectId, // or id (INT) in SQL
  full_name: String,
  email: String,
  phone: String,
  password_hash: String,
  
  skill_category: [String], // e.g., ["Plumber", "Electrician"]
  hourly_rate: Number, // e.g., 300 (INR per hour)
  
  location: {
    city: String,
    state: String,
    pincode: String,
  },

  availability: {
    status: String, // "online", "offline", "busy"
    working_hours: [
      {
        day: [String],       // "Monday"
        start_time: String, // "09:00"
        end_time: String    // "18:00"
      }
    ]
  },

  rating: {
    average: Number,
    total_reviews: Number
  },

  reviews: [
    {
    //   user_id: ObjectId,
      comment: String,
      rating: Number,
      created_at: Date
    }
  ],

  profile_picture_url:{
    type: String,
    default: '<img src="https://www.flaticon.com/free-icons/user">'
  },
  experience_years: Number,
  about: String, // Short bio or intro
  languages: [String], // e.g., ["Hindi", "English"]

  is_verified: Boolean,
  documents: [
    {
      doc_type: String, // "Aadhaar", "License"
      doc_url: String
    }
  ],

  created_at: Date,
  updated_at: Date
}

);

const Listing =mongoose.model("Listing",listingSchema);
module.exports =Listing;