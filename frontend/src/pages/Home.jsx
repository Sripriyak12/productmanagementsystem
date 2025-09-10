import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../AuthContext";

function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setProducts(products.filter((p) => p._id !== id));
      alert(`✅ ${data.message}`);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleUpdateSuccess = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
  };

  const uniqueCategories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === "All" || p.category === categoryFilter)
    )
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetFilters = () => {
    setSearch("");
    setSortOrder("asc");
    setCategoryFilter("All");
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

  return (
    <div className="home container">
      <div className="home-header">
        <h2>🛍️ Our Products</h2>

        <div className="filter-bar" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="🔍 Search products..."
            className="search-input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: "0.5rem", flex: "1 1 200px" }}
          />

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <label>Sort:</label>
            <select value={sortOrder} onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }} style={{ padding: "0.5rem" }}>
              <option value="asc">Price: Low → High</option>
              <option value="desc">Price: High → Low</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <label>Category:</label>
            <select value={categoryFilter} onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }} style={{ padding: "0.5rem" }}>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button onClick={resetFilters} style={{ padding: "0.5rem 1rem", background: "#eee", borderRadius: "4px" }}>
            Reset
          </button>
        </div>
      </div>

      <div className="product-grid">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              user={user}
              onDelete={user?.role === "admin" ? handleDelete : undefined}
              onUpdateSuccess={user?.role === "admin" ? handleUpdateSuccess : undefined}
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
            ⬅ Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
