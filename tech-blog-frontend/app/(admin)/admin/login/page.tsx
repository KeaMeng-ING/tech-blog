"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Login failed");
        return;
      }

      if (data.data.user.role !== "ADMIN") {
        setError("Access denied. Admin privileges required.");
        return;
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "400px", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "linear-gradient(135deg, #7c3aed, #22d3ee)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 style={{ color: "white", fontSize: "22px", fontWeight: 700, margin: 0, letterSpacing: "1px" }}>
            TECH BLOG
          </h1>
          <p style={{ color: "#6b7280", fontSize: "13px", margin: "6px 0 0" }}>
            Core Control System · Admin Access
          </p>
        </div>

        <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "16px", padding: "32px" }}>
          <h2 style={{ color: "white", fontSize: "18px", fontWeight: 600, margin: "0 0 6px" }}>Admin Sign In</h2>
          <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 24px" }}>
            Enter your admin credentials to access the control panel.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ color: "#9ca3af", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", display: "block", marginBottom: "8px" }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@techblog.io"
                style={{ width: "100%", background: "#13131f", border: "1px solid #1e1e35", borderRadius: "8px", padding: "11px 14px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ color: "#9ca3af", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", display: "block", marginBottom: "8px" }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: "100%", background: "#13131f", border: "1px solid #1e1e35", borderRadius: "8px", padding: "11px 14px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", background: loading ? "#4c1d95" : "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "none", borderRadius: "8px", padding: "12px", color: "white", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Authenticating..." : "Access Control Panel"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "#374151", fontSize: "12px", marginTop: "20px" }}>
          Tech Blog Admin · v2.0.4-stable
        </p>
      </div>
    </div>
  );
}