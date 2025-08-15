const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    },
    password_hash: {
      type: String,
      required: true
    },
    profile_picture_url: {
      type: String,
      default: "https://www.flaticon.com/free-icons/user"
    },
    address: {
      city: String,
      state: String,
      pincode: String
    },
    role: {
      type: String,
      enum: ["customer", "worker"],
      default: "customer"
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
