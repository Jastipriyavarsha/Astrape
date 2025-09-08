import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", { email, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        alert("Account created. You're logged in.");
        navigate("/items");
      } else {
        alert("Signup successful. Please login.");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2>Sign Up</h2>
      <div style={{ display: "grid", gap: 12 }}>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="btn btn-primary" type="submit">Create account</button>
      </div>
    </form>
  );
};

export default Signup;
