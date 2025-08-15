const express = require("express");
const app= express();
const mongoose =require("mongoose");
const Listing= require("./models/listing.js");
const bcrypt = require("bcrypt");
const User = require("./models/userlisting.js");
const path =require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-Mate");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


main()
.then((result)=>{
    console.log("connection established");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/HOURLY");
}


// // show all listing
// app.get("/listings",async (req,res)=>{
//     const allListing=await Listing.find({});
//     res.render("listing/index.ejs",{allListing});
// });

// Example route in app.js or routes/listing.js

// app.get('/listings', async (req, res) => {
//   const query = req.query;

//   // Apply filters here if needed (search, skills, location, sort, pagination...)
//   const allListing = await Listing.find({}); // or your filtered query

//   const pagination = {
//     totalPages: 1,
//     currentPage: 1,
//     queryString: '' // optionally build this for paginated links
//   };

//   res.render('listing/index', {
//     allListing,
//     query,         // ✅ <---- pass the query object to your view
//     pagination     // ✅ <---- if you’re using pagination
//   });
// });




app.get("/", (req, res) => {
  res.render("listing/first"); // your landing page
});

    




app.get('/signup-user', (req, res) => {
    res.render('listing/signup_user'); // This should be your customer signup page
});

// When "Sign Up as HOURLIER" is clicked
app.get('/signup-hourlier', (req, res) => {
    res.render('listing/signup_worker'); // This should be your worker signup page
});











// POST route for user signup
app.post("/signup", async (req, res) => {
  try {
    const { full_name, email, phone, password, confirmPassword } = req.body;

    // 1. Basic validation
    if (!full_name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).send("All fields are required");
    }
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email is already registered");
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create and save the new user
    const newUser = new User({
      full_name,
      email,
      phone,
      password_hash: hashedPassword,
      role: "customer"
    });

    await newUser.save();

    console.log("✅ User registered:", newUser._id);
    res.redirect("/login"); // or res.status(201).json({ message: "User created" })

  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).send("Server error");
  }
});






// Render login page
app.get("/login", (req, res) => {
  res.render("listing/login"); // assuming login.ejs is in /views
});



// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // 2. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    // 4. Success → create session or token (for now, simple redirect)
    console.log("✅ Login successful:", user._id);
    res.redirect("/dashboard"); // Change to your actual dashboard route

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).send("Server error");
  }
});


app.get("/dashboard",(req,res)=>{
  res.render("listing/index.ejs");
});




















app.get('/listings', async (req, res) => {
  const search = req.query.search?.trim() || "";
  let filter = {};

  try {
    // 1. Check for exact full name match
    const exactNameMatch = await Listing.findOne({
      full_name: { $regex: `^${search}$`, $options: "i" }
    });

    if (exactNameMatch) {
      return res.redirect(`/listing/${exactNameMatch._id}`);
    }

    // 2. If not name match, search by skill
    if (search) {
      const regex = new RegExp(search, 'i');
      filter = {
        skill_category: { $elemMatch: { $regex: regex } }
      };
    }

    const allListing = await Listing.find(filter);

    return res.render("listing/results", {
      allListing,
      query: req.query
    });

  } catch (err) {
    console.error("Error in /listings:", err);
    res.status(500).send("Internal Server Error");
  }
});






















//new listing route
app.get("/listing/new",(req,res)=>{
    res.render("listing/newlisting.ejs");
});


// // Show particulat customer detail
// app.get("/listing/:id",async (req,res)=>{
//     let {id}=req.params;
//     let listing= await Listing.findById(id);
//     res.render("listing/show.ejs",{user:listing});
// });






app.get('/listing/:id', async (req, res) => {
  try {
    const user = await Listing.findById(req.params.id);

    if (!user) {
      return res.status(404).render("listing/show", { user: null });
    }

    res.render("listing/show", { user });

  } catch (err) {
    console.error(err);
    res.status(500).render("listing/show", { user: null });
  }
});








//To new post route
app.post("/listing",async (req,res)=>{
    let listing= new Listing(req.body);
    await listing.save();
    res.redirect("/listings");
}); 

//Edit route
app.get("/listing/:id/edit",async(req,res)=>{
    let {id}= req.params;
    const list= await Listing.findById(id);
    res.render("listing/edit.ejs",{user:list});
});

app.put("/listing/:id",async(req,res)=>{
    let {id}= req.params;
    console.log(req.body);
    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/listing/${id}`);

});

app.delete("/listing/:id",async(req,res)=>{
    let {id}=req.params;
   const del= Listing.findByIdAndDelete(id);
    console.log(del);
    res.redirect("/listings");
});



let port =8080;

app.listen(port,()=>{
    console.log("express is working");
});

// app.get("/test",async (req,res)=>{
//     let sl=new Listing({
//   full_name: "Ravi Kumar",
//   email: "ravi.kumar@example.com",
//   phone: "9876543210",
//   password_hash: "hashedpassword123", // Make sure to hash passwords in real applications

//   skill_category: ["Electrician", "AC Mechanic"],
//   hourly_rate: 350,

//   location: {
//     city: "Delhi",
//     state: "Delhi",
//     pincode: "110001"
//   },

//   availability: {
//     status: "online",
//     working_hours: [
//       {
//         day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
//         start_time: "09:00",
//         end_time: "18:00"
//       }
//     ]
//   },

//   rating: {
//     average: 4.5,
//     total_reviews: 12
//   },

//   reviews: [
//     {
//       comment: "Great service, on time and professional!",
//       rating: 5,
//       created_at: new Date("2024-06-10")
//     },
//     {
//       comment: "Work was good, but came late.",
//       rating: 4,
//       created_at: new Date("2024-06-15")
//     }
//   ],

//   profile_picture_url: "https://example.com/images/ravi-profile.jpg",
//   experience_years: 5,
//   about: "Experienced electrician and HVAC specialist based in Delhi.",
//   languages: ["Hindi", "English"],

//   is_verified: true,
//   documents: [
//     {
//       doc_type: "Aadhaar",
//       doc_url: "https://example.com/docs/ravi-aadhaar.pdf"
//     },
//     {
//       doc_type: "License",
//       doc_url: "https://example.com/docs/ravi-license.pdf"
//     }
//   ],

//   created_at: new Date(),
//   updated_at: new Date()
// });
// const result=await sl.save();
// console.log("saved successfully");
// console.log("✅ Saved Document:", result);
// res.send("yes working");

    // });

