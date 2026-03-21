"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { formatPrice } from "@/lib/utils/format";
import { useUiStore } from "@/store/uiStore";

const COLOR_OPTIONS = ["Caramel", "Cream", "Sage", "Rose", "Ivory", "Beige", "Sand"];
const COLOR_SWATCH_CLASS = {
  Caramel: "bg-[#D29E74]",
  Cream: "bg-[#FDFBF7]",
  Sage: "bg-[#8F9B8B]",
  Rose: "bg-[#E5B4A0]",
  Ivory: "bg-[#FDFBF7]",
  Beige: "bg-[#F0E8D7]",
  Sand: "bg-[#F0E8D7]",
};
const SIZE_OPTIONS = ["NB", "0-3M", "3-6M", "6-9M", "9-12M"];
const TAG_OPTIONS = ["romper", "organic", "newborn", "occasion", "summer", "sale"];
const MATERIAL_OPTIONS = ["Organic Cotton", "Velvet Blend", "Bamboo Fiber", "Merino Wool"];
const IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;
const IMAGE_ALLOWED_TYPES = ["image/png", "image/jpeg", "image/svg+xml"];

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  price: "",
  comparePrice: "",
  stock: "",
  sku: "",
  brand: "KATERI",
  categorySlug: "",
  material: "",
  badge: "",
  isFeatured: false,
};

const emptyMaterialInfo = { description: "", bullets: [] };

/**
 * @typedef {{ file?: File, url?: string, previewUrl: string, alt: string }} ImageState
 */

export function AdminProductsPage() {
  const showToast = useUiStore((state) => state.showToast);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("create");
  const [editingSlug, setEditingSlug] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sizeStocks, setSizeStocks] = useState({});
  const [materialInfo, setMaterialInfo] = useState(emptyMaterialInfo);
  const [sizeChartRows, setSizeChartRows] = useState([]);
  const [images, setImages] = useState([]);

  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ value: cat.slug, label: cat.name })),
    [categories]
  );

  const resetDrawer = () => {
    setForm(emptyForm);
    setSelectedColors([]);
    setSelectedTags([]);
    setSizeStocks({});
    setMaterialInfo(emptyMaterialInfo);
    setSizeChartRows([]);
    setImages([]);
    setEditingSlug(null);
  };

  const closeDrawer = () => {
    images.forEach((img) => {
      if (img?.file && img.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
    setIsDrawerOpen(false);
    setTimeout(() => {
      resetDrawer();
    }, 200);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products?limit=100&sort=newest");
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to load products");
      }
      setProducts(json.data || []);
    } catch (error) {
      showToast(error.message || "Failed to load products", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (res.ok) {
        setCategories(json.data || []);
      }
    } catch (error) {
      showToast(error.message || "Failed to load categories", "error");
    }
  };

  const openCreateDrawer = () => {
    setDrawerMode("create");
    setIsDrawerOpen(true);
  };

  const openEditDrawer = async (slug) => {
    setDrawerMode("edit");
    setEditingSlug(slug);
    setIsDrawerOpen(true);
    try {
      const res = await fetch(`/api/products/${slug}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to load product");
      }
      const product = json.data;
      setForm({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        price: product.price?.toString() || "",
        comparePrice: product.comparePrice?.toString() || "",
        stock: product.stock?.toString() || "",
        sku: product.sku || "",
        brand: product.brand || "KATERI",
        categorySlug: product.category?.slug || "",
        material: product.material || "",
        badge: product.badge || "",
        isFeatured: !!product.isFeatured,
      });
      setSelectedColors(product.colors?.map((color) => color.name) || []);
      setSelectedTags(product.tags || []);
      const sizeMap = {};
      (product.sizes || []).forEach((size) => {
        sizeMap[size.size] = size.stock;
      });
      setSizeStocks(sizeMap);
      setMaterialInfo({
        description: product.materialInfo?.description || "",
        bullets: product.materialInfo?.bullets || [],
      });
      setSizeChartRows(product.sizeChart || []);
      setImages(
        (product.images || []).map((img) => ({
          url: img.url,
          previewUrl: img.url,
          alt: img.alt || product.name,
        }))
      );
    } catch (error) {
      showToast(error.message || "Failed to load product", "error");
    }
  };

  const handleDelete = async (slug) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to delete product");
      }
      showToast("Product deleted", "success");
      fetchProducts();
    } catch (error) {
      showToast(error.message || "Failed to delete product", "error");
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleSelection = (value, setter) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleSizeToggle = (size) => {
    setSizeStocks((prev) => {
      const updated = { ...prev };
      if (updated[size] !== undefined) {
        delete updated[size];
      } else {
        updated[size] = 0;
      }
      return updated;
    });
  };

  const handleSizeStockChange = (size, value) => {
    setSizeStocks((prev) => ({ ...prev, [size]: Number(value) }));
  };

  const handleBulletChange = (value) => {
    const bullets = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    setMaterialInfo((prev) => ({ ...prev, bullets }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter((file) => {
      if (!IMAGE_ALLOWED_TYPES.includes(file.type)) {
        showToast("Only PNG, JPG, or SVG images are allowed", "error");
        return false;
      }
      if (file.size > IMAGE_MAX_SIZE_BYTES) {
        showToast("Image size must be 5MB or less", "error");
        return false;
      }
      return true;
    });

    const previews = validFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      alt: file.name,
    }));

    setImages((prev) => [...prev, ...previews]);
  };

  const updateImageAlt = (index, value) => {
    setImages((prev) =>
      prev.map((img, idx) => (idx === index ? { ...img, alt: value } : img))
    );
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const target = prev[index];
      if (target?.file && target.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const addSizeChartRow = () => {
    setSizeChartRows((prev) => [...prev, { size: "", age: "", height: "", weight: "" }]);
  };

  const updateSizeChartRow = (index, field, value) => {
    setSizeChartRows((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
    );
  };

  const removeSizeChartRow = (index) => {
    setSizeChartRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const priceValue = Number(form.price);
    if (Number.isNaN(priceValue)) {
      showToast("Please enter a valid price", "error");
      return;
    }

    if (!form.categorySlug) {
      showToast("Please select a category", "error");
      return;
    }

    const colors = selectedColors.map((name) => ({
      name,
      swatchClass: COLOR_SWATCH_CLASS[name] || "bg-[#F5F0E6]",
    }));

    const sizes = Object.entries(sizeStocks).map(([size, stock]) => ({
      size,
      stock: Number(stock) || 0,
    }));

    try {
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("description", form.description.trim());
      payload.append("shortDescription", form.shortDescription.trim());
      payload.append("price", `${priceValue}`);
      payload.append("comparePrice", form.comparePrice ? `${Number(form.comparePrice)}` : "");
      payload.append("stock", form.stock ? `${Number(form.stock)}` : "0");
      payload.append("sku", form.sku.trim());
      payload.append("brand", form.brand.trim());
      payload.append("categorySlug", form.categorySlug);
      payload.append("material", form.material.trim());
      payload.append("badge", form.badge.trim());
      payload.append("isFeatured", form.isFeatured ? "true" : "false");
      payload.append("colors", JSON.stringify(colors));
      payload.append("sizes", JSON.stringify(sizes));
      payload.append("tags", JSON.stringify(selectedTags));
      payload.append("materialInfo", JSON.stringify(materialInfo));
      payload.append("sizeChart", JSON.stringify(sizeChartRows));

      if (drawerMode === "create") {
        payload.append("slug", form.slug.trim());
      }

      const existingImages = images.filter((img) => img.url && !img.file).map((img) => ({
        url: img.url,
        alt: img.alt || form.name,
      }));

      if (existingImages.length) {
        payload.append("existingImages", JSON.stringify(existingImages));
      }

      const imageAlts = [];
      images.forEach((img) => {
        if (img.file) {
          payload.append("images", img.file);
          imageAlts.push(img.alt || img.file.name || form.name);
        }
      });
      if (imageAlts.length) {
        payload.append("imageAlts", JSON.stringify(imageAlts));
      }

      const res = await fetch(
        drawerMode === "edit" ? `/api/products/${editingSlug}` : "/api/products",
        {
          method: drawerMode === "edit" ? "PUT" : "POST",
          body: payload,
        }
      );

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save product");
      }

      showToast(drawerMode === "edit" ? "Product updated" : "Product created", "success");
      closeDrawer();
      fetchProducts();
    } catch (error) {
      showToast(error.message || "Failed to save product", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#4A3525]">Products</h1>
          <p className="text-sm text-[#6B4F3B]/70">Manage your product catalog.</p>
        </div>
        <button
          type="button"
          onClick={openCreateDrawer}
          className="rounded-full bg-[#C28A5A] px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_4px_14px_rgba(194,138,90,0.35)] transition-colors hover:bg-[#B07848]"
        >
          Add Product
        </button>
      </div>

      <div className="bg-white border border-[#F5F0E6] rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B4F3B]/70 border-b border-[#F5F0E6]">
          <span className="col-span-2">Product</span>
          <span>Price</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        {isLoading ? (
          <div className="px-6 py-8 text-sm text-[#6B4F3B]/70">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="px-6 py-8 text-sm text-[#6B4F3B]/70">No products found.</div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-[#F5F0E6] text-sm text-[#4A3525]"
            >
              <div className="col-span-2">
                <p className="font-semibold">{product.name}</p>
                <p className="text-xs text-[#6B4F3B]/70">{product.slug}</p>
              </div>
              <span>{formatPrice(product.price)}</span>
              <span className="text-xs uppercase tracking-wider text-[#6B4F3B]/70">
                {product.stock > 0 ? "Active" : "Out of stock"}
              </span>
              <div className="flex items-center justify-end gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => openEditDrawer(product.slug)}
                  className="text-[#A4550A] hover:text-[#EC7F13]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product.slug)}
                  className="text-[#C15C5C] hover:text-[#8B3F3F]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="Close drawer"
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/40"
          />
          <div className="ml-auto h-full w-full sm:w-[30vw] bg-white shadow-2xl overflow-y-auto relative z-10">
            <div className="p-6 border-b border-[#F5F0E6]">
              <h2 className="text-2xl font-serif font-bold text-[#4A3525]">
                {drawerMode === "edit" ? "Edit Product" : "Create Product"}
              </h2>
              <p className="text-sm text-[#6B4F3B]/70">
                Fill in the product details and upload images.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <label className="text-sm font-semibold text-[#4A3525]">
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                  required
                />
              </label>
              <label className="text-sm font-semibold text-[#4A3525]">
                Slug
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm disabled:bg-[#FAF9F6]"
                  required
                  disabled={drawerMode === "edit"}
                />
              </label>
              <label className="text-sm font-semibold text-[#4A3525]">
                SKU
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                  required
                />
              </label>
              <label className="text-sm font-semibold text-[#4A3525]">
                Category
                <select
                  name="categorySlug"
                  value={form.categorySlug}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                  required
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-[#4A3525]">
                Material
                <select
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                >
                  <option value="">Select material</option>
                  {MATERIAL_OPTIONS.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm font-semibold text-[#4A3525]">
                  Price
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                    required
                  />
                </label>
                <label className="text-sm font-semibold text-[#4A3525]">
                  Compare Price
                  <input
                    name="comparePrice"
                    value={form.comparePrice}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm font-semibold text-[#4A3525]">
                  Stock
                  <input
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                  />
                </label>
                <label className="text-sm font-semibold text-[#4A3525]">
                  Badge
                  <input
                    name="badge"
                    value={form.badge}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                  />
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="isFeatured"
                  name="isFeatured"
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-[#EAE4DD]"
                />
                <label htmlFor="isFeatured" className="text-sm font-semibold text-[#4A3525]">
                  Feature this product
                </label>
              </div>

              <label className="text-sm font-semibold text-[#4A3525] block">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                  required
                />
              </label>
              <label className="text-sm font-semibold text-[#4A3525] block">
                Short Description
                <textarea
                  name="shortDescription"
                  value={form.shortDescription}
                  onChange={handleChange}
                  rows={2}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                />
              </label>

              <div>
                <p className="text-sm font-semibold text-[#4A3525] mb-2">Colors</p>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => toggleSelection(color, setSelectedColors)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        selectedColors.includes(color)
                          ? "border-[#A4550A] text-[#A4550A] bg-[#FDF0DF]"
                          : "border-[#EAE4DD] text-[#6B4F3B]"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#4A3525] mb-2">Sizes & Stock</p>
                <div className="space-y-2">
                  {SIZE_OPTIONS.map((size) => {
                    const selected = sizeStocks[size] !== undefined;
                    return (
                      <div key={size} className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            selected
                              ? "border-[#A4550A] text-[#A4550A] bg-[#FDF0DF]"
                              : "border-[#EAE4DD] text-[#6B4F3B]"
                          }`}
                        >
                          {size}
                        </button>
                        {selected && (
                          <input
                            type="number"
                            min="0"
                            value={sizeStocks[size]}
                            onChange={(event) => handleSizeStockChange(size, event.target.value)}
                            className="w-24 rounded-lg border border-[#EAE4DD] px-3 py-1 text-xs"
                            placeholder="Stock"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#4A3525] mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleSelection(tag, setSelectedTags)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        selectedTags.includes(tag)
                          ? "border-[#A4550A] text-[#A4550A] bg-[#FDF0DF]"
                          : "border-[#EAE4DD] text-[#6B4F3B]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#4A3525]">Material Info</p>
                <textarea
                  value={materialInfo.description}
                  onChange={(event) =>
                    setMaterialInfo((prev) => ({ ...prev, description: event.target.value }))
                  }
                  rows={2}
                  className="w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                  placeholder="Short material description"
                />
                <textarea
                  value={materialInfo.bullets.join("\n")}
                  onChange={(event) => handleBulletChange(event.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                  placeholder="Bullet points (one per line)"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#4A3525]">Size Chart</p>
                  <button
                    type="button"
                    onClick={addSizeChartRow}
                    className="text-xs font-semibold text-[#A4550A]"
                  >
                    Add Row
                  </button>
                </div>
                {sizeChartRows.map((row, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2">
                    <input
                      value={row.size || ""}
                      onChange={(event) => updateSizeChartRow(index, "size", event.target.value)}
                      className="rounded-lg border border-[#EAE4DD] px-2 py-1 text-xs"
                      placeholder="Size"
                    />
                    <input
                      value={row.age || ""}
                      onChange={(event) => updateSizeChartRow(index, "age", event.target.value)}
                      className="rounded-lg border border-[#EAE4DD] px-2 py-1 text-xs"
                      placeholder="Age"
                    />
                    <input
                      value={row.height || ""}
                      onChange={(event) => updateSizeChartRow(index, "height", event.target.value)}
                      className="rounded-lg border border-[#EAE4DD] px-2 py-1 text-xs"
                      placeholder="Height"
                    />
                    <input
                      value={row.weight || ""}
                      onChange={(event) => updateSizeChartRow(index, "weight", event.target.value)}
                      className="rounded-lg border border-[#EAE4DD] px-2 py-1 text-xs"
                      placeholder="Weight"
                    />
                    <button
                      type="button"
                      onClick={() => removeSizeChartRow(index)}
                      className="col-span-4 text-xs font-semibold text-[#C15C5C] text-left"
                    >
                      Remove row
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#4A3525]">Images</p>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  multiple
                  onChange={handleImageChange}
                  className="w-full text-xs"
                />
                <p className="text-xs text-[#6B4F3B]/70">
                  PNG, JPG, or SVG only. Max 5MB per file.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="border border-[#EAE4DD] rounded-lg p-2 space-y-2">
                      <div className="relative w-full aspect-[4/5] bg-[#F5F0E6] rounded-md overflow-hidden">
                        <Image
                          src={image.previewUrl}
                          alt={image.alt}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                      <input
                        value={image.alt}
                        onChange={(event) => updateImageAlt(index, event.target.value)}
                        className="w-full rounded-md border border-[#EAE4DD] px-2 py-1 text-xs"
                        placeholder="Alt text"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-xs font-semibold text-[#C15C5C]"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#C28A5A] px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_4px_14px_rgba(194,138,90,0.35)] transition-colors hover:bg-[#B07848]"
                >
                  {drawerMode === "edit" ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex-1 rounded-full border border-[#EAE4DD] px-5 py-3 text-sm font-semibold tracking-wide text-[#6B4F3B]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
