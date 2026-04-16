"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { postsService } from "@/services/posts.service";
import { Post, PostStatus } from "@/types";

const statusColors: Record<PostStatus, { bg: string; color: string }> = {
  PUBLISHED: { bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
  SCHEDULED: { bg: "rgba(234,179,8,0.1)", color: "#eab308" },
  DRAFT: { bg: "rgba(107,114,128,0.1)", color: "#9ca3af" },
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const load = async () => {
    setLoading(true);
    try {
      const res = await postsService.getAll({
        status: status || undefined,
        search: search || undefined,
        page,
        limit,
      });
      setPosts(res.posts);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await postsService.delete(id);
    load();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ color: "#a78bfa", fontSize: "36px", fontWeight: 700, margin: "0 0 4px" }}>Manage Posts</h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>Editorial control center for all platform content.</p>
        </div>
        <Link
          href="/admin/posts/create"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          + Create New Post
        </Link>
      </div>

      {/* Stats mini */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "TOTAL POSTS", value: total, sub: "+12% this week", subColor: "#22d3ee" },
          { label: "GLOBAL VIEWS", value: "842.1K", sub: "Live now", subColor: "#22c55e" },
          { label: "SCHEDULED", value: posts.filter((p) => p.status === "SCHEDULED").length, sub: "Queue clear", subColor: "#6b7280" },
          { label: "DRAFTS", value: posts.filter((p) => p.status === "DRAFT").length, sub: "Requires action", subColor: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", padding: "18px 20px" }}>
            <div style={{ color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "8px" }}>{s.label}</div>
            <div style={{ color: "white", fontSize: "28px", fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: s.subColor, fontSize: "11px", marginTop: "4px" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "center" }}>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "8px", padding: "8px 12px", color: "white", fontSize: "13px", cursor: "pointer" }}
        >
          <option value="">Status: All</option>
          <option value="PUBLISHED">Published</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="DRAFT">Draft</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search posts..."
          style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "8px", padding: "8px 14px", color: "white", fontSize: "13px", outline: "none", minWidth: "220px" }}
        />
        <div style={{ marginLeft: "auto", color: "#6b7280", fontSize: "12px" }}>
          Displaying {posts.length} of {total} posts
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e35" }}>
              {["POST DETAIL", "CATEGORY", "SOURCE", "STATUS", "ACTIONS"].map((h) => (
                <th key={h} style={{ padding: "14px 16px", color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading...</td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>No posts found.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} style={{ borderBottom: "1px solid #13131f" }}>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          background: "#1e1e35",
                          borderRadius: "6px",
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        {post.thumbnailUrl && (
                          <img src={post.thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                      </div>
                      <div>
                        <div style={{ color: "white", fontWeight: 600, fontSize: "14px" }}>{post.title}</div>
                        <div style={{ color: "#6b7280", fontSize: "11px", marginTop: "2px" }}>
                          {post.updatedAt ? `Updated ${new Date(post.updatedAt).toLocaleDateString()}` : ""}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    {post.category && (
                      <span style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.5px" }}>
                        {post.category.name.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "16px", color: "#9ca3af", fontSize: "13px" }}>
                    {post.source ? new URL(post.source).hostname : "—"}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        background: statusColors[post.status].bg,
                        color: statusColors[post.status].color,
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: "4px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      ● {post.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        href={`/admin/posts/create?edit=${post.id}`}
                        style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ background: "none", border: "none", color: page === 1 ? "#374151" : "#9ca3af", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px" }}
          >
            ← Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: page === p ? "#7c3aed" : "none",
                border: page === p ? "none" : "1px solid #1e1e35",
                color: "white",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ background: "none", border: "none", color: page === totalPages ? "#374151" : "#9ca3af", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "13px" }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}