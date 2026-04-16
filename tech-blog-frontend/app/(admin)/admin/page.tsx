"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminService } from "@/services/newsletter.service";
import { postsService } from "@/services/posts.service";
import { DashboardStats, Post } from "@/types";

function StatCard({
  label,
  value,
  sub,
  subColor = "#22d3ee",
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#0e0e1a",
        border: "1px solid #1e1e35",
        borderRadius: "12px",
        padding: "20px 24px",
        flex: 1,
      }}
    >
      <div style={{ color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {label}
        <span style={{ color: "#374151" }}>{icon}</span>
      </div>
      <div style={{ color: "white", fontSize: "32px", fontWeight: 700 }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      {sub && (
        <div style={{ color: subColor, fontSize: "12px", marginTop: "4px" }}>{sub}</div>
      )}
    </div>
  );
}

// Simple SVG area chart
function AreaChart() {
  const points = [30, 45, 35, 60, 75, 65, 80, 70, 85, 72, 60, 50];
  const w = 560;
  const h = 200;
  const max = 100;
  const pts = points.map((p, i) => ({
    x: (i / (points.length - 1)) * w,
    y: h - (p / max) * h,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />
    </svg>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scheduled, setScheduled] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p] = await Promise.all([
          adminService.getStats(),
          postsService.getAll({ status: "SCHEDULED", limit: 4 }),
        ]);
        setStats(s);
        setScheduled(p.posts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ color: "#a78bfa", fontSize: "36px", fontWeight: 700, margin: "0 0 4px" }}>
        System Overview
      </h1>
      <p style={{ color: "#6b7280", margin: "0 0 32px", fontSize: "14px" }}>
        Operational status:{" "}
        <span style={{ color: "#22d3ee" }}>Optimal</span> | Node: US-EAST-01
      </p>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "28px" }}>
        <StatCard
          label="TOTAL POSTS"
          value={loading ? "—" : stats?.total ?? 0}
          sub="+12%"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
        />
        <StatCard
          label="DRAFT POSTS"
          value={loading ? "—" : stats?.draft ?? 0}
          subColor="#6b7280"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          }
        />
        <StatCard
          label="SCHEDULED"
          value={loading ? "—" : stats?.scheduled ?? 0}
          subColor="#6b7280"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
        <StatCard
          label="PUBLISHED"
          value={loading ? "—" : stats?.published ?? 0}
          subColor="#6b7280"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
        />
        <StatCard
          label="SUBSCRIBERS"
          value={loading ? "—" : stats ? (stats.totalSubs >= 1000 ? `${(stats.totalSubs / 1000).toFixed(1)}k` : stats.totalSubs) : 0}
          sub={`+${stats?.activeSubs ?? 0} active`}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px" }}>
        {/* Chart */}
        <div
          style={{
            background: "#0e0e1a",
            border: "1px solid #1e1e35",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <h3 style={{ color: "white", margin: 0, fontSize: "16px", fontWeight: 600 }}>Network Traffic</h3>
              <p style={{ color: "#6b7280", margin: "4px 0 0", fontSize: "12px" }}>Active sessions across global nodes</p>
            </div>
            <span
              style={{
                background: "rgba(34,211,238,0.1)",
                border: "1px solid rgba(34,211,238,0.2)",
                color: "#22d3ee",
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "6px",
              }}
            >
              Real-time Data
            </span>
          </div>
          <div style={{ height: "200px" }}>
            <AreaChart />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            {["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"].map((t) => (
              <span key={t} style={{ color: "#374151", fontSize: "11px" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Upcoming Queue */}
        <div
          style={{
            background: "#0e0e1a",
            border: "1px solid #1e1e35",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ color: "white", margin: 0, fontSize: "16px", fontWeight: 600 }}>Upcoming Queue</h3>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </div>

          {loading ? (
            <p style={{ color: "#6b7280", fontSize: "13px" }}>Loading...</p>
          ) : scheduled.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: "13px" }}>No scheduled posts.</p>
          ) : (
            scheduled.map((post) => (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "16px",
                  padding: "10px",
                  background: "#13131f",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "linear-gradient(135deg, #1e1e35, #2d2d4e)",
                    borderRadius: "8px",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  {post.thumbnailUrl && (
                    <img src={post.thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "white", fontSize: "13px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {post.title}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "11px", marginTop: "2px" }}>
                    {post.scheduledAt ? new Date(post.scheduledAt).toLocaleString() : "—"}
                  </div>
                </div>
              </div>
            ))
          )}

          <Link
            href="/admin/posts"
            style={{
              display: "block",
              textAlign: "center",
              padding: "10px",
              background: "#13131f",
              border: "1px solid #1e1e35",
              borderRadius: "8px",
              color: "white",
              fontSize: "13px",
              fontWeight: 500,
              textDecoration: "none",
              marginTop: "8px",
            }}
          >
            View Full Schedule
          </Link>
        </div>
      </div>
    </div>
  );
}