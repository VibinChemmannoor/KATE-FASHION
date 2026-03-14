import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, required: true },
    src: { type: String, default: "" },
  },
  { _id: false }
);

const ColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    swatchClass: { type: String, required: true },
  },
  { _id: false }
);

const SizeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    stock: { type: Number, required: true },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    price: { type: Number, required: true },
    comparePrice: { type: Number, default: null },
    stock: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
    brand: { type: String, default: "" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    categorySlug: { type: String, required: true },
    images: { type: [ImageSchema], default: [] },
    colors: { type: [ColorSchema], default: [] },
    sizes: { type: [SizeSchema], default: [] },
    tags: { type: [String], default: [] },
    material: { type: String, default: "" },
    gender: { type: String, default: "girls" },
    ageGroup: { type: String, default: "" },
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
    badge: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    materialInfo: {
      description: { type: String, default: "" },
      bullets: { type: [String], default: [] },
    },
    sizeChart: {
      type: [
        {
          size: String,
          age: String,
          height: String,
          weight: String,
        },
      ],
      default: [],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
