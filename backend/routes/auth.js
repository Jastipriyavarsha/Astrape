const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.post("/signup", async (req,res)=>{
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const exists = await User.findOne({ email });
    if(exists) return res.status(400).json({ message:"Email already exists" });
    const user = await User.create({ email, password });
    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn:"7d" });
    res.status(201).json({ message:"Signup success", token });
  } catch(err){ res.status(500).json({ message:err.message }); }
});

router.post("/login", async (req,res)=>{
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message:"Invalid credentials" });
    const isMatch = await user.comparePassword(password);
    if(!isMatch) return res.status(400).json({ message:"Invalid credentials" });

    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn:"7d" });
    res.json({ token });
  } catch(err){ res.status(500).json({ message:err.message }); }
});

module.exports = router;

// Verify token and get profile
router.get("/me", auth, async (req, res) => {
  res.json({ id: req.user._id, email: req.user.email });
});
