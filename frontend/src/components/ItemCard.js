import React from "react";

export default function ItemCard({ item, addToCart }) {
  return (
    <div className="card">
      <img src={item.image} alt={item.title} />
      <div className="card-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0 }}>{item.title}</h4>
          <span className="badge">{item.category}</span>
        </div>
        <div className="price-row">
          <div className="price">${item.price}</div>
          <button className="btn btn-primary" onClick={() => addToCart(item)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
