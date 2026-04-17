"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { getUser } from "@/lib/api";

const navItems = [
  {
    label: "DASHBOARD",
    href: "/admin",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "POSTS",
    href: "/admin/posts",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "CATEGORIES",
    href: "/admin/categories",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    label: "NEWSLETTER",
    href: "/admin/newsletters",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "USERS",
    href: "/admin/users",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  const handleLogout = async () => {
    await authService.logout();
    router.push("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      style={{
        width: "220px",
        height: "100vh",
        background: "#0e0e1a",
        borderRight: "1px solid #1e1e35",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 40,
        overflow: "hidden", // ✅ prevent outer overflow
      }}
    >
      {/* Brand */}
      <div style={{ padding: "0 20px 28px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            borderRadius: "10px",
            padding: "12px",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: "12px", letterSpacing: "1px" }}>
              CORE CONTROL
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px" }}>v2.0.4-stable</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{
            flex: 1,
            padding: "0 12px",
            overflowY: "auto",
            minHeight: 0,
          }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "8px",
              marginBottom: "2px",
              textDecoration: "none",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.8px",
              color: isActive(item.href) ? "white" : "#6b7280",
              background: isActive(item.href)
                ? "linear-gradient(90deg, rgba(124,58,237,0.3), rgba(124,58,237,0.1))"
                : "transparent",
              borderLeft: isActive(item.href)
                ? "2px solid #7c3aed"
                : "2px solid transparent",
              transition: "all 0.2s",
            }}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}