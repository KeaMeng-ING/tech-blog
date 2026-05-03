"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postsService } from "@/services/posts.service";
import { categoriesService } from "@/services/categories.service";
import { Category, CreatePostInput, PostStatus } from "@/types";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: "44px",
        height: "24px",
        background: checked ? "#7c3aed" : "#1e1e35",
        borderRadius: "12px",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "23px" : "3px",
          width: "18px",
          height: "18px",
          background: "white",
          borderRadius: "50%",
          transition: "left 0.2s",
        }}
      />
    </div>
  );
}

function CreatePostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreatePostInput>({
    title: "",
    slug: "",
    shortDesc: "",
    content: "",
    thumbnailUrl: "",
    source: "",
    status: "DRAFT",
    scheduledAt: "",
    categoryId: "",
  });

  useEffect(() => {
    categoriesService.getAll().then(setCategories);
    if (editId) {
      postsService.getById(editId).then((post) => {
        setForm({
          title: post.title,
          slug: post.slug,
          shortDesc: post.shortDesc,
          content: post.content,
          thumbnailUrl: post.thumbnailUrl || "",
          source: post.source || "",
          status: post.status,
          scheduledAt: post.scheduledAt
            ? new Date(post.scheduledAt).toISOString().slice(0, 16)
            : "",
          categoryId: post.category?.id || "",
        });
      });
    }
  }, [editId]);

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm((f) => ({ ...f, title, slug }));
  };

  const toISO = (val: string): string | undefined =>
    val ? new Date(val).toISOString() : undefined;

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const data = { ...form, status: "DRAFT" as PostStatus, scheduledAt: toISO(form.scheduledAt ?? "") };
      if (editId) await postsService.update(editId, data);
      else await postsService.create(data);
      router.push("/admin/posts");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error saving draft");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNow = async () => {
    setLoading(true);
    try {
      const data = { ...form, status: "PUBLISHED" as PostStatus, scheduledAt: undefined };
      if (editId) await postsService.update(editId, data);
      else await postsService.create(data);
      router.push("/admin/posts");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error publishing post");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!form.scheduledAt) {
      alert("Please set a schedule date first.");
      return;
    }
    setLoading(true);
    try {
      const data = { ...form, status: "SCHEDULED" as PostStatus, scheduledAt: toISO(form.scheduledAt ?? "") };
      if (editId) await postsService.update(editId, data);
      else await postsService.create(data);
      router.push("/admin/posts");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error scheduling post");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#13131f",
    border: "1px solid #1e1e35",
    borderRadius: "8px",
    padding: "11px 14px",
    color: "white",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    color: "#9ca3af",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.8px",
    display: "block",
    marginBottom: "8px",
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ color: "#a78bfa", fontSize: "32px", fontWeight: 700, margin: "0 0 4px" }}>
            {editId ? "Edit Post" : "Create New Post"}
          </h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>
            Crafting the next breakthrough in the TechEcosystem.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleSaveDraft}
            disabled={loading}
            style={{
              background: "none",
              border: "1px solid #1e1e35",
              borderRadius: "8px",
              padding: "10px 20px",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Save Draft
          </button>
          <button
            onClick={handlePublishNow}
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #059669, #047857)",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Publish Now
          </button>
          <button
            onClick={handleSchedule}
            disabled={loading}
            style={{
              background: form.scheduledAt
                ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                : "#1e1e35",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              color: form.scheduledAt ? "white" : "#6b7280",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Schedule Post
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Main form card */}
          <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", padding: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>POST TITLE</label>
              <input
                style={inputStyle}
                placeholder="The Future of Quantum Computing in 2024..."
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={labelStyle}>CATEGORY</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>PRIMARY SOURCE</label>
                <input
                  style={inputStyle}
                  placeholder="https://research.tech.io"
                  value={form.source}
                  onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>SHORT DESCRIPTION</label>
              <textarea
                style={{ ...inputStyle, height: "80px", resize: "vertical" }}
                placeholder="A concise summary for the article feed and SEO..."
                value={form.shortDesc}
                onChange={(e) => setForm((f) => ({ ...f, shortDesc: e.target.value }))}
              />
            </div>
          </div>

          {/* Content editor card */}
          <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>FULL ARTICLE CONTENT</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["B", "I", "≡", "⋈", "🖼", "</>"].map((t) => (
                  <button
                    key={t}
                    style={{ background: "#13131f", border: "1px solid #1e1e35", borderRadius: "4px", padding: "4px 8px", color: "#9ca3af", fontSize: "12px", cursor: "pointer" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              style={{ ...inputStyle, height: "280px", resize: "vertical", fontFamily: "monospace", lineHeight: "1.6" }}
              placeholder="Start writing your masterpiece... Use Markdown to format your editorial."
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Feature image */}
          <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", padding: "20px" }}>
            <label style={labelStyle}>FEATURE IMAGE</label>
            <div
              style={{
                background: "#13131f",
                border: "2px dashed #1e1e35",
                borderRadius: "8px",
                padding: "24px",
                textAlign: "center",
                marginBottom: "12px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" style={{ margin: "0 auto 8px", display: "block" }}>
                <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>Drop image to upload</p>
              <p style={{ color: "#374151", fontSize: "11px", margin: "4px 0 0" }}>PNG, JPG, WEBP (MAX 5MB)</p>
            </div>
            <input
              style={inputStyle}
              placeholder="Or paste image URL..."
              value={form.thumbnailUrl}
              onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
            />
          </div>

          {/* Publication settings */}
          <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", padding: "20px" }}>
            <label style={labelStyle}>PUBLICATION SETTINGS</label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <div style={{ color: "white", fontSize: "13px", fontWeight: 500 }}>URL Slug</div>
                <div style={{ color: "#6b7280", fontSize: "11px" }}>{form.slug || "auto-generated"}</div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #1e1e35", paddingTop: "16px" }}>
              <label style={labelStyle}>SCHEDULE PUBLISH</label>
              <input
                type="datetime-local"
                style={inputStyle}
                value={form.scheduledAt}
                onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
              />
            </div>
          </div>

          {/* SEO Preview */}
          <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", padding: "20px" }}>
            <label style={labelStyle}>SEARCH PREVIEW</label>
            <div style={{ background: "#13131f", borderRadius: "8px", padding: "14px" }}>
              <div style={{ color: "#22d3ee", fontSize: "11px", marginBottom: "4px" }}>
                TechEcosystem › post › {form.slug || "the-fu..."}
              </div>
              <div style={{ color: "#7c3aed", fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                {form.title || "Post Title Here"}
              </div>
              <div style={{ color: "#9ca3af", fontSize: "12px", lineHeight: "1.4", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                {form.shortDesc || "Your short description will appear here..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreatePostPage() {
  return (
    <Suspense fallback={<div style={{ color: "white", padding: "32px" }}>Loading...</div>}>
      <CreatePostForm />
    </Suspense>
  );
}