"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useUiStore } from "@/store/uiStore";

const buildJsonField = (value) => (value ? JSON.stringify(value, null, 2) : "");

const parseJsonField = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

/**
 * @param {{ mode: "create" | "edit", slug?: string }} props
 */
export function AdminProductFormPage({ mode, slug }) {
  const router = useRouter();
  const showToast = useUiStore((state) => state.showToast);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(mode === "edit");

  const [form, setForm] = useState({
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
  });

  const [imagesJson, setImagesJson] = useState("");
  const [colorsJson, setColorsJson] = useState("");
  const [sizesJson, setSizesJson] = useState("");
  const [tagsJson, setTagsJson] = useState("");
  const [materialInfoJson, setMaterialInfoJson] = useState("");
  const [sizeChartJson, setSizeChartJson] = useState("");

  const isEdit = mode === "edit";

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const loadCategories = async () => {
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

  const loadProduct = async () => {
    if (!isEdit || !slug) return;
    setIsLoading(true);
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
      setImagesJson(buildJsonField(product.images || []));
      setColorsJson(buildJsonField(product.colors || []));
      setSizesJson(buildJsonField(product.sizes || []));
      setTagsJson(buildJsonField(product.tags || []));
      setMaterialInfoJson(buildJsonField(product.materialInfo || { description: "", bullets: [] }));
      setSizeChartJson(buildJsonField(product.sizeChart || []));
    } catch (error) {
      showToast(error.message || "Failed to load product", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ value: cat.slug, label: cat.name })),
    [categories]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const images = parseJsonField(imagesJson, []);
    const colors = parseJsonField(colorsJson, []);
    const sizes = parseJsonField(sizesJson, []);
    const tags = parseJsonField(tagsJson, []);
    const materialInfo = parseJsonField(materialInfoJson, {});
    const sizeChart = parseJsonField(sizeChartJson, []);

    if (images === null || colors === null || sizes === null || tags === null || materialInfo === null || sizeChart === null) {
      showToast("Invalid JSON in one of the detail fields", "error");
      return;
    }

    const priceValue = Number(form.price);
    if (Number.isNaN(priceValue)) {
      showToast("Please enter a valid price", "error");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      shortDescription: form.shortDescription.trim(),
      price: priceValue,
      comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
      stock: form.stock ? Number(form.stock) : 0,
      sku: form.sku.trim(),
      brand: form.brand.trim(),
      categorySlug: form.categorySlug,
      material: form.material.trim(),
      badge: form.badge.trim(),
      isFeatured: form.isFeatured,
      images,
      colors,
      sizes,
      tags,
      materialInfo,
      sizeChart,
    };

    if (!isEdit) {
      payload.slug = form.slug.trim();
    }

    try {
      const res = await fetch(isEdit ? `/api/products/${slug}` : "/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save product");
      }

      showToast(isEdit ? "Product updated" : "Product created", "success");
      router.push("/admin/products");
    } catch (error) {
      showToast(error.message || "Failed to save product", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#4A3525]">
            {isEdit ? "Edit Product" : "Create Product"}
          </h1>
          <p className="text-sm text-[#6B4F3B]/70">
            Add product details, images, and merchandising metadata.
          </p>
        </div>
        <Link href="/admin/products" className="text-sm font-semibold text-[#A4550A]">
          Back to Products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#F5F0E6] rounded-2xl p-8 shadow-sm space-y-6">
        {isLoading ? (
          <p className="text-sm text-[#6B4F3B]/70">Loading product...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  disabled={isEdit}
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
                Brand
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
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
                <input
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
                />
              </label>
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

            <label className="text-sm font-semibold text-[#4A3525] block">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="text-sm font-semibold text-[#4A3525] block">
                Images (JSON)
                <textarea
                  value={imagesJson}
                  onChange={(event) => setImagesJson(event.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-xs font-mono"
                  placeholder='[{"url":"/Assets/product-1.jpg","alt":"Front view"}]'
                />
              </label>
              <label className="text-sm font-semibold text-[#4A3525] block">
                Colors (JSON)
                <textarea
                  value={colorsJson}
                  onChange={(event) => setColorsJson(event.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-xs font-mono"
                  placeholder='[{"name":"Caramel","swatchClass":"bg-[#D29E74]"}]'
                />
              </label>
              <label className="text-sm font-semibold text-[#4A3525] block">
                Sizes (JSON)
                <textarea
                  value={sizesJson}
                  onChange={(event) => setSizesJson(event.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-xs font-mono"
                  placeholder='[{"size":"0-3M","stock":10}]'
                />
              </label>
              <label className="text-sm font-semibold text-[#4A3525] block">
                Tags (JSON)
                <textarea
                  value={tagsJson}
                  onChange={(event) => setTagsJson(event.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-xs font-mono"
                  placeholder='["romper","organic"]'
                />
              </label>
              <label className="text-sm font-semibold text-[#4A3525] block">
                Material Info (JSON)
                <textarea
                  value={materialInfoJson}
                  onChange={(event) => setMaterialInfoJson(event.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-xs font-mono"
                  placeholder='{"description":"...","bullets":["..."]}'
                />
              </label>
              <label className="text-sm font-semibold text-[#4A3525] block">
                Size Chart (JSON)
                <textarea
                  value={sizeChartJson}
                  onChange={(event) => setSizeChartJson(event.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-xs font-mono"
                  placeholder='[{"size":"NB","age":"Up to 1M"}]'
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#C28A5A] px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_4px_14px_rgba(194,138,90,0.35)] transition-colors hover:bg-[#B07848]"
            >
              {isEdit ? "Update Product" : "Create Product"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
