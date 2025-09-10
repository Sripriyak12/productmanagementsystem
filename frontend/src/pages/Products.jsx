import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../AuthContext";
// Optional: Toasts for better UX
// import { toast } from "react-hot-toast";

function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch products");
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (loading) return; // prevent double delete
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert(`✅ ${data.message}`);
      // toast.success(data.message);
    } catch (err) {
      console.error("Error deleting product:", err);
      // toast.error("Failed to delete product");
    }
  };

  const handleUpdateSuccess = (updatedData) => {
    const updatedProduct = updatedData.product;
    setProducts((prev) =>
      prev
        .filter((p) => p._id !== updatedProduct._id) // remove old
        .concat(updatedProduct)                      // add updated
    );
  };

  return (
    <div className="products">
      <h2>Products</h2>
      <div className="product-list" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              user={user}
              onDelete={user?.role === "admin" ? handleDelete : undefined}
              onUpdateSuccess={user?.role === "admin" ? handleUpdateSuccess : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Products;
