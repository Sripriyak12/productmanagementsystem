const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique:true,
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"]
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true,
      default: "" // ✅ Stores relative path like /uploads/filename.jpg
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
