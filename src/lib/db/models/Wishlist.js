import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Wishlist =
  mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);
