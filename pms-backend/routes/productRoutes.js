
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken, requireAdmin } = require("../middleware/auth");
const Product = require("../models/Product");

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });


// ✅ Create product (with duplicate check)
router.post("/", verifyToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image?.trim();

    if (imagePath && !imagePath.startsWith("/uploads") && !/^https?:\/\/.+/i.test(imagePath)) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const existing = await Product.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Product with this name already exists" });
    }

    const product = new Product({
      name: name.trim(),
      price: Number(price),
      description: description?.trim(),
      category: category?.trim(),
      image: imagePath
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    console.error("❌ Error creating product:", err.message);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ price: 1 });
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Server error while fetching products" });
  }
});


// ✅ PUT update product (supports FormData or JSON)
router.put("/:id", verifyToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, description, category } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const existing = await Product.findById(productId);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Validate fields
    if (name && typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }

    if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    // ✅ Determine image path
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image?.trim();

    if (imagePath && !imagePath.startsWith("/uploads") && !/^https?:\/\/.+/i.test(imagePath)) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    // ✅ Apply updates
    existing.name = name ? name.trim() : existing.name;
    existing.price = price !== undefined ? Number(price) : existing.price;
    existing.description = description ? description.trim() : existing.description;
    existing.category = category ? category.trim() : existing.category;
    existing.image = imagePath || existing.image;

    await existing.save();
    res.json({ message: "✅ Product updated successfully", product: existing });
  } catch (err) {
    console.error("❌ Error updating product:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE product
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: `Product '${deleted.name}' deleted successfully` });
  } catch (err) {
    console.error("❌ Error deleting product:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
