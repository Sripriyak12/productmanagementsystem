import React from "react";
import ProductForm from "../components/ProductForm";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const handleAddProduct = async (productData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}` // ✅ Don't set Content-Type manually
        },
        body: productData // ✅ This is FormData from ProductForm
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(`✅ Product "${data.product.name}" added successfully!`);
      navigate("/");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="container">
      <div className="add-product-container">
        <h2>Add New Product</h2>
        <ProductForm onSubmit={handleAddProduct} />
      </div>
    </div>
  );
}

export default AddProduct;
