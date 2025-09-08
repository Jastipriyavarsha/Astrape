import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const syncGuestCartToServer = async () => {
    try {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      if (!Array.isArray(guestCart) || guestCart.length === 0) return;
      for (const entry of guestCart) {
        if (entry?.itemId && entry?.qty) {
          await API.post("/cart", { itemId: entry.itemId, qty: entry.qty });
        }
      }
      localStorage.removeItem("guest_cart");
    } catch (_) {
      // ignore sync errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      await syncGuestCartToServer();
      navigate("/items");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2>Login</h2>
      <div style={{ display: "grid", gap: 12 }}>
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit">Login</button>
      </div>
    </form>
  );
}
