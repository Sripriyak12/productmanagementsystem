import React, { useState, useEffect } from "react";

function ProductForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price?.toString() || "",
        category: initialData.category || "",
        description: initialData.description || ""
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (formData.price === "" || isNaN(formData.price)) {
      newErrors.price = "Price must be a number";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (formData.description.length > 300) {
      newErrors.description = "Description must be under 300 characters";
    }

    if (!imageFile && !initialData?.image) {
      newErrors.image = "Image file is required";
    } else if (imageFile) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(imageFile.type)) {
        newErrors.image = "Only JPG, PNG, or WEBP files are allowed";
      }
      if (imageFile.size > 2 * 1024 * 1024) {
        newErrors.image = "Image must be under 2MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value // ✅ Keep as string until submission
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formPayload = new FormData();
    formPayload.append("name", formData.name.trim());
    formPayload.append("price", Number(formData.price)); // ✅ Convert here
    formPayload.append("category", formData.category.trim());
    formPayload.append("description", formData.description.trim());

    if (imageFile) {
      formPayload.append("image", imageFile);
    } else if (initialData?.image) {
      formPayload.append("image", initialData.image);
    }

    onSubmit(formPayload);
  };

  const isUpdateMode = initialData !== null;

  const imagePreviewSrc = imageFile
    ? URL.createObjectURL(imageFile)
    : initialData?.image?.startsWith("/uploads")
    ? `http://localhost:5000${initialData.image}`
    : initialData?.image || "";

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
      />
      {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
      />
      {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
      />
      {errors.category && <p style={{ color: "red" }}>{errors.category}</p>}

      <textarea
        name="description"
        placeholder="Description (optional)"
        value={formData.description}
        onChange={handleChange}
      />
      {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}

      {imagePreviewSrc && (
        <img
          src={imagePreviewSrc}
          alt="Preview"
          style={{
            width: "100%",
            maxHeight: "200px",
            objectFit: "cover",
            marginBottom: "1rem",
            borderRadius: "4px"
          }}
        />
      )}

      {isUpdateMode && (
        <p style={{ marginBottom: "0.5rem", fontSize: "0.95rem", color: "#555" }}>
          If you want to update the image, select a new one below. Otherwise, the existing image will be retained.
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {errors.image && <p style={{ color: "red" }}>{errors.image}</p>}

      <button type="submit">
        {isUpdateMode ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}

export default ProductForm;
