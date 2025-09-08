import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const isAuthed = Boolean(localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-badge">🛍</span>
          <span>Astrape</span>
        </div>
        <nav className="nav">
          <Link to="/items">Items</Link>
          <Link to="/cart">Cart</Link>
          {isAuthed ? (
            <button className="btn btn-ghost" onClick={logout}>Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ textDecoration: "none" }}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
