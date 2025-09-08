import React, { useEffect, useState } from "react";
import API from "../api/api";
import ItemCard from "../components/ItemCard";

export default function Items() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [categoriesInput, setCategoriesInput] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);

  const addToCart = async (item) => {
    const token = localStorage.getItem("token");
    if (token) {
      await API.post("/cart", { itemId: item._id, qty: 1 });
      alert("Added to cart!");
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const idx = guestCart.findIndex((e) => e.itemId === item._id);
      if (idx >= 0) guestCart[idx].qty += 1;
      else guestCart.push({ itemId: item._id, qty: 1, price: item.price, title: item.title });
      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      alert("Added to cart (guest)");
    }
  };

  const handleFilter = () => {
    let result = items;
    if (category) {
      result = result.filter((i) => i.category === category);
    }
    result = result.filter(
      (i) => i.price >= priceRange[0] && i.price <= priceRange[1]
    );
    setFilteredItems(result);
  };

  useEffect(() => {
    const fetch = async () => {
      const params = {};
      if (category) params.category = category;
      if (priceRange[0] != null) params.minPrice = priceRange[0];
      if (priceRange[1] != null) params.maxPrice = priceRange[1];
      if (categoriesInput.trim()) params.categories = categoriesInput;
      if (search.trim()) params.q = search.trim();
      const res = await API.get("/items", { params });
      setItems(res.data);
      setFilteredItems(res.data);
    };
    fetch();
  }, [category, priceRange, categoriesInput, search]);

  useEffect(() => {
    const loadCategories = async () => {
      try{
        const res = await API.get("/items/categories");
        const list = Array.isArray(res.data) ? res.data : [];
        if (list.length > 0) setCategories(list);
        else setCategories(["Electronics","Clothing","Home","Footwear","Accessories","Books"]);
      }catch(err){
        // fallback to known categories if request fails
        setCategories(["Electronics","Clothing","Home","Footwear","Accessories","Books"]);
        // eslint-disable-next-line no-console
        console.error("Failed to load categories", err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [category, priceRange]);

  return (
    <div className="container">
      <h2 style={{ marginTop: 12, marginBottom: 12 }}>Items</h2>
      <div className="filters">
        <label className="label" style={{ flex: 1, minWidth: 220 }}>
          Search
          <input
            className="input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
          />
        </label>
        <label className="label">
          Category
          <select className="input" value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map((c)=> (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="label">
          Categories (comma separated)
          <input
            className="input"
            type="text"
            value={categoriesInput}
            onChange={(e) => setCategoriesInput(e.target.value)}
            placeholder="Electronics,Books"
          />
        </label>
        <label className="label">
          Min price
          <input
            className="input"
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            style={{ width: "120px" }}
          />
        </label>
        <label className="label">
          Max price
          <input
            className="input"
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            style={{ width: "120px" }}
          />
        </label>
      </div>
      <div className="cards-grid">
        {filteredItems.map((item) => (
          <ItemCard key={item._id} item={item} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}
