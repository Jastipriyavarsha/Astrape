require("dotenv").config();
const mongoose = require("mongoose");
const Item = require("./models/Item");

const CATEGORIES = [
  { key: "Electronics", base: 1999 },
  { key: "Clothing", base: 799 },
  { key: "Home", base: 1299 },
  { key: "Footwear", base: 1499 },
  { key: "Accessories", base: 699 },
  { key: "Books", base: 499 },
];

const makeTitle = (cat, i) => {
  switch(cat){
    case "Electronics": return ["Smartphone","Laptop","Headphones","Speaker","Smartwatch","Camera","Tablet","Monitor","Keyboard","Mouse"][i];
    case "Clothing": return ["T-Shirt","Jeans","Hoodie","Jacket","Shirt","Shorts","Skirt","Dress","Sweater","Cap"][i];
    case "Home": return ["Microwave","Air Fryer","Coffee Maker","Vacuum","Lamp","Chair","Cookware","Toaster","Kettle","Blender"][i];
    case "Footwear": return ["Running Shoes","Sneakers","Sandals","Boots","Loafers","Heels","Flip Flops","Trainers","Clogs","Derby"][i];
    case "Accessories": return ["Backpack","Wallet","Sunglasses","Belt","Watch","Scarf","Gloves","Hat","Tie","Bracelet"][i];
    case "Books": return ["Book: JS Guide","Book: CSS Mastery","Book: React","Book: Node","Book: Mongo","Book: HTML","Book: GraphQL","Book: TS","Book: DSA","Book: Clean Code"][i];
    default: return `${cat} Item ${i+1}`;
  }
}

const PRODUCTS = CATEGORIES.flatMap(({key, base}) => {
  return Array.from({ length: 10 }).map((_, i) => ({
    title: makeTitle(key, i),
    price: base + (i * Math.floor(base / 3)) + 99,
    category: key,
    image: `https://picsum.photos/seed/${encodeURIComponent(key.toLowerCase()+"-"+(i+1))}/400/300`
  }));
});

mongoose.connect(process.env.MONGO_URI).then(async ()=>{
  console.log("🌱 Seeding database...");
  await Item.deleteMany({});
  await Item.insertMany(PRODUCTS);
  console.log("✅ Database seeded with products!");
  process.exit();
});
