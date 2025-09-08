const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getItems, createItem, updateItem, deleteItem, getCategories } = require("../controllers/itemController");

// Public get with filters
router.get("/", getItems);
router.get("/categories", getCategories);

// Protected routes (admin)
router.post("/", auth, createItem);
router.put("/:id", auth, updateItem);
router.delete("/:id", auth, deleteItem);

module.exports = router;
