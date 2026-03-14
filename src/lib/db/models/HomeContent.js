import mongoose from "mongoose";

const HomeContentSchema = new mongoose.Schema(
  {
    hero: { type: mongoose.Schema.Types.Mixed, required: true },
    newArrivals: { type: mongoose.Schema.Types.Mixed, required: true },
    categories: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const HomeContent =
  mongoose.models.HomeContent || mongoose.model("HomeContent", HomeContentSchema);
