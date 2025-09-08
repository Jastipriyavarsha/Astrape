const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");
const Item = require("../models/Item");

// Get user cart
router.get("/", auth, async (req,res)=>{
  let cart = await Cart.findOne({ user:req.user._id }).populate("items.item");
  if(!cart) cart = await Cart.create({ user:req.user._id, items:[] });
  res.json(cart.items);
});

// Add to cart
router.post("/", auth, async (req,res)=>{
  const { itemId, qty } = req.body;
  let cart = await Cart.findOne({ user:req.user._id });
  if(!cart) cart = await Cart.create({ user:req.user._id, items:[] });

  const exist = cart.items.find(i=>i.item.toString()===itemId);
  if(exist) exist.qty += qty;
  else cart.items.push({ item:itemId, qty });
  await cart.save();
  await cart.populate("items.item");
  res.json(cart.items);
});

// Remove item
router.delete("/:id", auth, async (req,res)=>{
  const cart = await Cart.findOne({ user:req.user._id });
  if(!cart) return res.status(404).json({ message:"Cart not found" });
  cart.items = cart.items.filter(i=>i.item.toString() !== req.params.id);
  await cart.save();
  await cart.populate("items.item");
  res.json(cart.items);
});

// Update quantity
router.put("/:id", auth, async (req,res)=>{
  const { qty } = req.body;
  const cart = await Cart.findOne({ user:req.user._id });
  if(!cart) return res.status(404).json({ message:"Cart not found" });
  const entry = cart.items.find(i=>i.item.toString() === req.params.id);
  if(!entry) return res.status(404).json({ message:"Item not in cart" });
  entry.qty = qty;
  cart.items = cart.items.filter(i=>i.qty > 0);
  await cart.save();
  await cart.populate("items.item");
  res.json(cart.items);
});

module.exports = router;
