import React, { useEffect, useState } from "react";
import API from "../api/api";
import CartItem from "../components/CartItem";

export default function Cart() {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await API.get("/cart");
      // backend returns array of { item: {..}, qty }
      const normalized = (res.data || []).map((ci) => ({
        _id: ci.item?._id,
        title: ci.item?.title,
        price: ci.item?.price,
        qty: ci.qty,
      }));
      setCart(normalized);
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      setCart(guestCart.map((g) => ({ _id: g.itemId, title: g.title, price: g.price, qty: g.qty })));
    }
  };

  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem("token");
    if (token) {
      await API.delete(`/cart/${itemId}`);
      fetchCart();
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const updated = guestCart.filter((e) => e.itemId !== itemId);
      localStorage.setItem("guest_cart", JSON.stringify(updated));
      setCart(updated.map((g) => ({ _id: g.itemId, title: g.title, price: g.price, qty: g.qty })));
    }
  };

  const updateQty = async (itemId, qty) => {
    const newQty = Math.max(0, qty);
    const token = localStorage.getItem("token");
    if (token) {
      await API.put(`/cart/${itemId}`, { qty: newQty });
      fetchCart();
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const updated = guestCart.map((e) => (e.itemId === itemId ? { ...e, qty: newQty } : e)).filter((e) => e.qty > 0);
      localStorage.setItem("guest_cart", JSON.stringify(updated));
      setCart(updated.map((g) => ({ _id: g.itemId, title: g.title, price: g.price, qty: g.qty })));
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="container">
      <h2 style={{ marginTop: 12, marginBottom: 12 }}>Your Cart</h2>
      {cart.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>Cart is empty</p>
      ) : (
        <>
          <div style={{ display: "grid", gap: 10 }}>
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <CartItem
                  item={item}
                  removeFromCart={removeFromCart}
                  updateQty={updateQty}
                />
              </div>
            ))}
          </div>
          <div className="total">
            <h3>Total</h3>
            <h3>${total.toFixed(2)}</h3>
          </div>
        </>
      )}
    </div>
  );
}
