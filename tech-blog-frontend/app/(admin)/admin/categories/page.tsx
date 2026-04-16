"use client";

import { useEffect, useState } from "react";
import { categoriesService } from "@/services/categories.service";
import { Category } from "@/types";

function Modal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, slug: string) => Promise<void>;
  initial?: Category;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initial?.name || "");
    setSlug(initial?.slug || "");
  }, [initial, open]);

  if (!open) return null;

  const handleNameChange = (v: string) => {
    setName(v);
    if (!initial) setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(name, slug);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#13131f",
    border: "1px solid #1e1e35",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "white",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
    marginBottom: "16px",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "14px", padding: "28px", width: "420px" }}>
        <h3 style={{ color: "white", margin: "0 0 20px", fontSize: "18px", fontWeight: 600 }}>
          {initial ? "Edit Category" : "Add New Category"}
        </h3>
        <label style={{ color: "#9ca3af", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", display: "block", marginBottom: "8px" }}>CATEGORY NAME</label>
        <input style={inputStyle} value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Web Development" />
        <label style={{ color: "#9ca3af", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", display: "block", marginBottom: "8px" }}>SLUG</label>
        <input style={inputStyle} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="web-development" />
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #1e1e35", borderRadius: "8px", padding: "9px 18px", color: "#9ca3af", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={loading || !name || !slug} style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "none", borderRadius: "8px", padding: "9px 18px", color: "white", fontSize: "13px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Saving..." : "Save Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();

  const load = async () => {
    setLoading(true);
    try {
      setCategories(await categoriesService.getAll());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (name: string, slug: string) => {
    if (editing) await categoriesService.update(editing.id, { name, slug });
    else await categoriesService.create({ name, slug });
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Posts in this category may be affected.")) return;
    await categoriesService.delete(id);
    load();
  };

  const openEdit = (cat: Category) => { setEditing(cat); setModalOpen(true); };
  const openCreate = () => { setEditing(undefined); setModalOpen(true); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ color: "#a78bfa", fontSize: "36px", fontWeight: 700, margin: "0 0 4px" }}>Taxonomy & Categories</h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "14px", maxWidth: "460px" }}>
            Manage the structural architecture of TECHECKSYSTEM. Define technical domains and organize content.
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "none", borderRadius: "8px", padding: "10px 20px", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          + Add New Category
        </button>
      </div>

      {/* Cards grid */}
      {loading ? (
        <p style={{ color: "#6b7280" }}>Loading...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              style={{
                background: "#0e0e1a",
                border: "1px solid #1e1e35",
                borderRadius: "12px",
                padding: "20px",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: `linear-gradient(135deg, ${["#7c3aed","#0891b2","#059669","#d97706","#dc2626"][i % 5]}, ${["#4f46e5","#0e7490","#047857","#b45309","#b91c1c"][i % 5]})`,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => openEdit(cat)}
                    style={{ background: "#13131f", border: "1px solid #1e1e35", borderRadius: "6px", padding: "4px 8px", color: "#9ca3af", fontSize: "11px", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", padding: "4px 8px", color: "#f87171", fontSize: "11px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <h3 style={{ color: "white", fontSize: "16px", fontWeight: 700, margin: "0 0 4px" }}>{cat.name}</h3>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 16px" }}>/{cat.slug}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1e1e35", paddingTop: "12px" }}>
                <span style={{ color: "#6b7280", fontSize: "12px" }}>
                  Created {new Date(cat.createdAt).toLocaleDateString()}
                </span>
                <span style={{ color: "white", fontSize: "20px", fontWeight: 700 }}>
                  {cat._count?.posts ?? 0}
                  <span style={{ color: "#6b7280", fontSize: "10px", fontWeight: 400, marginLeft: "4px" }}>POSTS</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e1e35" }}>
          <h3 style={{ color: "white", margin: 0, fontSize: "16px", fontWeight: 600 }}>Category Performance Audit</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e35" }}>
              {["ID", "CATEGORY NAME", "SLUG", "POSTS", "CREATED", "SETTINGS"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id} style={{ borderBottom: "1px solid #13131f" }}>
                <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "12px" }}>#{`CAT-${String(i + 1).padStart(3, "0")}`}</td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "6px", height: "6px", background: "#22c55e", borderRadius: "50%" }} />
                    <span style={{ color: "white", fontWeight: 600, fontSize: "14px" }}>{cat.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", color: "#9ca3af", fontSize: "13px" }}>/{cat.slug}</td>
                <td style={{ padding: "14px 16px", color: "#a78bfa", fontWeight: 700 }}>{cat._count?.posts ?? 0}</td>
                <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "12px" }}>{new Date(cat.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "14px 16px" }}>
                  <button onClick={() => openEdit(cat)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editing} />
    </div>
  );
}