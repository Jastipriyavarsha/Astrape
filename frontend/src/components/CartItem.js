import React from "react";

export default function CartItem({ item, removeFromCart, updateQty }) {
  return (
    <div>
      <h4 style={{ margin: 0 }}>{item.title}</h4>
      <p style={{ margin: "6px 0", color: "#94a3b8" }}>
        ${item.price} x {item.qty}
      </p>
      <div className="qty">
        <button className="btn" onClick={() => updateQty(item._id, item.qty - 1)}>-</button>
        <span>{item.qty}</span>
        <button className="btn" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
        <button className="btn btn-danger" onClick={() => removeFromCart(item._id)} style={{ marginLeft: 8 }}>Remove</button>
      </div>
    </div>
  );
}
