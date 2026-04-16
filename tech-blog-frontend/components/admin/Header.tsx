"use client";

import { getUser } from "@/lib/api";

export default function Header() {
  const user = getUser();

  return (
    <header
      style={{
        height: "60px",
        background: "#0a0a14",
        borderBottom: "1px solid #1e1e35",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "fixed",
        top: 0,
        left: "220px",
        right: 0,
        zIndex: 30,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg, #7c3aed, #22d3ee)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <span
          style={{
            color: "white",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "1px",
          }}
        >
          TECH BLOG
        </span>
      </div>

      {/* Search */}
      <div style={{ position: "relative", width: "300px" }}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          placeholder="Global System Search..."
          style={{
            width: "100%",
            background: "#13131f",
            border: "1px solid #1e1e35",
            borderRadius: "8px",
            padding: "8px 12px 8px 36px",
            color: "#9ca3af",
            fontSize: "13px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9ca3af",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              width: "8px",
              height: "8px",
              background: "#7c3aed",
              borderRadius: "50%",
            }}
          />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "white", fontSize: "12px", fontWeight: 600 }}>
              {user?.email?.split("@")[0].toUpperCase() || "ADMIN_ROOT"}
            </div>
            <div style={{ color: "#6b7280", fontSize: "10px" }}>OPERATOR</div>
          </div>
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            {user?.email?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}