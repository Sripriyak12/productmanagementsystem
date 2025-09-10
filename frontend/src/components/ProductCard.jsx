import React, { useState } from "react";
import Modal from "./Modal";
import ProductForm from "./ProductForm";

function ProductCard({ product, user, onDelete, onUpdateSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDisabled, setDeleteDisabled] = useState(false);

  const placeholderImage = "https://via.placeholder.com/250x200.png?text=No+Image";

  const handleUpdate = async (updatedProduct) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || token === "undefined" || token === "null" || token.length < 10) {
        throw new Error("No valid token found. Please log in.");
      }

      let payload;
      let headers = { Authorization: `Bearer ${token}` };

      if (updatedProduct instanceof FormData) {
        payload = updatedProduct;
      } else {
        payload = JSON.stringify({
          name: updatedProduct.name?.trim(),
          price: Number(updatedProduct.price),
          description: updatedProduct.description?.trim(),
          category: updatedProduct.category?.trim(),
          image: typeof updatedProduct.image === "string" ? updatedProduct.image.trim() : ""
        });
        headers["Content-Type"] = "application/json";
      }

      setLoading(true);

      const res = await fetch(`http://localhost:5000/api/products/${product._id}`, {
        method: "PUT",
        headers,
        body: payload
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) throw new Error(data.message || "Update failed");

      onUpdateSuccess && onUpdateSuccess(data.product);
      alert("✅ Product updated successfully");
      setIsEditing(false);
    } catch (err) {
      setLoading(false);
      console.error("❌ Failed to update product:", err);
      alert(`❌ Update failed: ${err.message}`);
    }
  };

  const handleDeleteClick = () => {
    if (deleteDisabled || loading) return;
    setDeleteDisabled(true);
    onDelete(product._id);
  };

  const imageSrc = product.image?.startsWith("/uploads")
    ? `http://localhost:5000${product.image}`
    : product.image?.startsWith("http")
    ? product.image
    : placeholderImage;

  return (
    <>
      <div className="product-card" style={{ position: "relative", padding: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}>
        {loading && (
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "1.2rem",
            zIndex: 2
          }}>
            Processing...
          </div>
        )}

        <img
          src={imageSrc}
          alt={product.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "4px",
            marginBottom: "0.5rem"
          }}
          onError={(e) => { e.target.src = placeholderImage; }}
        />

        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>₹{product.price}</p>
        {product.category && (
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            <strong>Category:</strong> {product.category}
          </p>
        )}

        {user?.role === "admin" && (
          <div className="actions" style={{ marginTop: "0.5rem" }}>
            <button onClick={() => setIsEditing(true)} disabled={loading}>Edit</button>
            <button onClick={handleDeleteClick} disabled={loading || deleteDisabled}>Delete</button>
          </div>
        )}
      </div>

      {isEditing && (
        <Modal onClose={() => setIsEditing(false)}>
          <h2>Edit Product</h2>
          <ProductForm initialData={product} onSubmit={handleUpdate} />
        </Modal>
      )}
    </>
  );
}

export default ProductCard;
