import mongoose from "mongoose";

const ProductImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, default: null },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true },
    brand: { type: String, default: "KATE FASHION" },
    images: [ProductImageSchema],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    tags: [{ type: String }],
    sizes: [{ type: String }],
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
      },
    ],
    material: { type: String, default: "" },
    ageGroup: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["boy", "girl", "unisex"],
      default: "unisex",
    },
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    badge: { type: String, default: "" },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1 });

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
