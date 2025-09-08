require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const cartRoutes = require("./routes/cart");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async ()=>{
    console.log("MongoDB connected");
    // Attempt to drop legacy unique index on username if present
    try {
      const User = require("./models/User");
      const indexes = await User.collection.indexes();
      const hasUsername = indexes.find(i => i.name === "username_1");
      if (hasUsername) {
        await User.collection.dropIndex("username_1");
        console.log("Dropped legacy index username_1 from users collection");
      }
    } catch (e) {
      // ignore if not present or cannot drop
    }
  })
  .catch(err=>console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
