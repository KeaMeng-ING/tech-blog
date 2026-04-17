"use client";

import { useRouter } from "next/navigation";
import { getUser } from "@/lib/api";
import { authService } from "@/services/auth.service";

export default function Header() {
  const user = getUser();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push("/admin/login");
  };

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


      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

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
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "8px",
              padding: "6px 12px",
              color: "#f87171",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}