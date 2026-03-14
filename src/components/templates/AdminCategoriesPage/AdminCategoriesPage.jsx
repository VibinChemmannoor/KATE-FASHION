"use client";

import { useEffect, useState } from "react";

import { useUiStore } from "@/store/uiStore";

export function AdminCategoriesPage() {
  const showToast = useUiStore((state) => state.showToast);
  const [categories, setCategories] = useState([]);
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    order: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to load categories");
      }
      setCategories(json.data || []);
    } catch (error) {
      showToast(error.message || "Failed to load categories", "error");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const isEditing = Boolean(editingSlug);
      const res = await fetch(isEditing ? `/api/categories/${editingSlug}` : "/api/categories", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),
          image: form.image.trim(),
          order: form.order ? Number(form.order) : 0,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save category");
      }
      showToast(isEditing ? "Category updated" : "Category created", "success");
      setForm({ name: "", slug: "", description: "", image: "", order: "" });
      setEditingSlug(null);
      fetchCategories();
    } catch (error) {
      showToast(error.message || "Failed to save category", "error");
    }
  };

  const handleEdit = (category) => {
    setEditingSlug(category.slug);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image: category.image || "",
      order: category.order?.toString() || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingSlug(null);
    setForm({ name: "", slug: "", description: "", image: "", order: "" });
  };

  const handleDelete = async (slug) => {
    const confirmed = window.confirm("Delete this category?");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/categories/${slug}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to delete category");
      }
      showToast("Category deleted", "success");
      fetchCategories();
    } catch (error) {
      showToast(error.message || "Failed to delete category", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#4A3525]">Categories</h1>
        <p className="text-sm text-[#6B4F3B]/70">
          Categories created here will appear in the Shop by Category section.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#F5F0E6] rounded-2xl p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6"
      >
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
            className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
            required
            disabled={Boolean(editingSlug)}
          />
        </label>
        <label className="text-sm font-semibold text-[#4A3525] md:col-span-2">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-semibold text-[#4A3525]">
          Image URL
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-semibold text-[#4A3525]">
          Order
          <input
            name="order"
            value={form.order}
            onChange={handleChange}
            type="number"
            min="0"
            className="mt-2 w-full rounded-lg border border-[#EAE4DD] px-4 py-2 text-sm"
          />
        </label>
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="flex-1 rounded-full bg-[#C28A5A] px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_4px_14px_rgba(194,138,90,0.35)] transition-colors hover:bg-[#B07848]"
          >
            {editingSlug ? "Update Category" : "Create Category"}
          </button>
          {editingSlug && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 rounded-full border border-[#EAE4DD] px-5 py-3 text-sm font-semibold tracking-wide text-[#6B4F3B] hover:border-[#C28A5A]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white border border-[#F5F0E6] rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-4 gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B4F3B]/70 border-b border-[#F5F0E6]">
          <span>Category</span>
          <span>Slug</span>
          <span>Order</span>
          <span className="text-right">Actions</span>
        </div>
        {categories.length === 0 ? (
          <div className="px-6 py-8 text-sm text-[#6B4F3B]/70">No categories found.</div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-[#F5F0E6] text-sm text-[#4A3525]"
            >
              <span className="font-semibold">{category.name}</span>
              <span className="text-xs text-[#6B4F3B]/70">{category.slug}</span>
              <span>{category.order || 0}</span>
              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => handleEdit(category)}
                  className="text-xs font-semibold text-[#A4550A] hover:text-[#EC7F13]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category.slug)}
                  className="text-xs font-semibold text-[#C15C5C] hover:text-[#8B3F3F]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
