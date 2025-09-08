const Item = require("../models/Item");

// Get items with filters
exports.getItems = async (req,res)=>{
  try{
    const { category, categories, minPrice, maxPrice, q } = req.query;
    let query = {};
    // category or categories (comma-separated)
    if (categories) {
      const list = String(categories)
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      if (list.length > 0) query.category = { $in: list };
    } else if (category) {
      query.category = category;
    }
    // price range
    if (minPrice != null || maxPrice != null) {
      query.price = {};
      if (minPrice != null) query.price.$gte = Number(minPrice);
      if (maxPrice != null) query.price.$lte = Number(maxPrice);
    }
    if (q) {
      query.title = { $regex: String(q), $options: "i" };
    }
    const items = await Item.find(query);
    res.json(items);
  }catch(err){ res.status(500).json({ message:err.message }); }
}

// Get distinct categories
exports.getCategories = async (req,res)=>{
  try{
    const categories = await Item.distinct("category");
    res.json(categories);
  }catch(err){ res.status(500).json({ message:err.message }); }
}

// Create item
exports.createItem = async (req,res)=>{
  try{
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  }catch(err){ res.status(400).json({ message:err.message }); }
}

// Update item
exports.updateItem = async (req,res)=>{
  try{
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new:true });
    res.json(item);
  }catch(err){ res.status(400).json({ message:err.message }); }
}

// Delete item
exports.deleteItem = async (req,res)=>{
  try{
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message:"Deleted" });
  }catch(err){ res.status(400).json({ message:err.message }); }
}
