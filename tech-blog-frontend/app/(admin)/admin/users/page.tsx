"use client";

import { useEffect, useState } from "react";
import { usersService } from "@/services/users.service";
import { User, Role } from "@/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = async () => {
    setLoading(true);
    try {
      setUsers(await usersService.getAll());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (id: string, role: Role) => {
    setActionLoading(id);
    try {
      const updated = await usersService.changeRole(id, role);
      setUsers((u) => u.map((user) => (user.id === id ? { ...user, role: updated.role } : user)));
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleDisable = async (id: string, current: boolean) => {
    setActionLoading(id);
    try {
      const updated = await usersService.toggleDisable(id, !current);
      setUsers((u) => u.map((user) => (user.id === id ? { ...user, isDisabled: updated.isDisabled } : user)));
    } finally {
      setActionLoading(null);
    }
  };

  const paged = users.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(users.length / perPage);
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const activeCount = users.filter((u) => !u.isDisabled).length;
  const disabledCount = users.filter((u) => u.isDisabled).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ color: "#a78bfa", fontSize: "36px", fontWeight: 700, margin: "0 0 4px" }}>User Management</h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>Directory › Core Operators</p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "28px" }}>
        <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", padding: "20px 24px" }}>
          <div style={{ color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "8px" }}>TOTAL ECOSYSTEM NODES</div>
          <div style={{ color: "white", fontSize: "32px", fontWeight: 700 }}>{loading ? "—" : users.length.toLocaleString()}</div>
          <div style={{ color: "#22d3ee", fontSize: "12px", marginTop: "4px" }}>+12% vs LY</div>
        </div>
        <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", padding: "20px 24px" }}>
          <div style={{ color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "8px" }}>ACTIVE USERS</div>
          <div style={{ color: "white", fontSize: "32px", fontWeight: 700 }}>{loading ? "—" : activeCount}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
            <div style={{ width: "6px", height: "6px", background: "#22c55e", borderRadius: "50%" }} />
            <span style={{ color: "#22c55e", fontSize: "12px" }}>Live</span>
          </div>
        </div>
        <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.1))", border: "1px solid #7c3aed", borderRadius: "12px", padding: "20px 24px" }}>
          <div style={{ color: "#a78bfa", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "8px" }}>ADMIN ACCOUNTS</div>
          <div style={{ color: "white", fontSize: "32px", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px" }}>
            {loading ? "—" : adminCount}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", overflow: "hidden", marginBottom: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e35" }}>
              {["CORE OPERATOR", "EMAIL", "ACCESS MATRIX", "ECOSYSTEM STATUS", "ACTIONS"].map((h) => (
                <th key={h} style={{ padding: "14px 16px", color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading...</td></tr>
            ) : paged.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #13131f" }}>
                <td style={{ padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        background: user.role === "ADMIN"
                          ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                          : "linear-gradient(135deg, #1e1e35, #2d2d4e)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "13px",
                        flexShrink: 0,
                      }}
                    >
                      {user.email[0].toUpperCase()}
                    </div>
                    <span style={{ color: "white", fontWeight: 500, fontSize: "14px" }}>
                      {user.name || user.email.split("@")[0]}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "16px", color: "#9ca3af", fontSize: "13px" }}>{user.email}</td>
                <td style={{ padding: "16px" }}>
                  <span
                    style={{
                      background: user.role === "ADMIN" ? "rgba(124,58,237,0.2)" : "rgba(107,114,128,0.15)",
                      color: user.role === "ADMIN" ? "#a78bfa" : "#9ca3af",
                      border: `1px solid ${user.role === "ADMIN" ? "rgba(124,58,237,0.3)" : "rgba(107,114,128,0.2)"}`,
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    {user.role === "ADMIN" ? "⊕ Admin" : "⊙ User"}
                  </span>
                </td>
                <td style={{ padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        background: user.isDisabled ? "#ef4444" : "#22c55e",
                        borderRadius: "50%",
                      }}
                    />
                    <span style={{ color: user.isDisabled ? "#ef4444" : "#22c55e", fontSize: "13px" }}>
                      {user.isDisabled ? "Disabled" : "Active Protocol"}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "16px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      disabled={!!actionLoading}
                      onClick={() => handleRoleChange(user.id, user.role === "ADMIN" ? "USER" : "ADMIN")}
                      style={{
                        background: "rgba(124,58,237,0.1)",
                        border: "1px solid rgba(124,58,237,0.2)",
                        borderRadius: "6px",
                        padding: "5px 10px",
                        color: "#a78bfa",
                        fontSize: "11px",
                        cursor: actionLoading ? "not-allowed" : "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {user.role === "ADMIN" ? "→ User" : "→ Admin"}
                    </button>
                    <button
                      disabled={!!actionLoading}
                      onClick={() => handleToggleDisable(user.id, user.isDisabled)}
                      style={{
                        background: user.isDisabled ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        border: `1px solid ${user.isDisabled ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                        borderRadius: "6px",
                        padding: "5px 10px",
                        color: user.isDisabled ? "#22c55e" : "#f87171",
                        fontSize: "11px",
                        cursor: actionLoading ? "not-allowed" : "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {user.isDisabled ? "Enable" : "Disable"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#6b7280", fontSize: "13px" }}>
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, users.length)} of {users.length} nodes
          </span>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "6px", padding: "6px 12px", color: "#9ca3af", cursor: "pointer", fontSize: "13px" }}>←</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                style={{ background: page === p ? "#7c3aed" : "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "6px", padding: "6px 12px", color: "white", cursor: "pointer", fontSize: "13px" }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "6px", padding: "6px 12px", color: "#9ca3af", cursor: "pointer", fontSize: "13px" }}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}