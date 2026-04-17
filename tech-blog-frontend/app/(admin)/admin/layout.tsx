"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getUser } from "@/lib/api";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setMounted(true);
    if (isLoginPage) return;
    const token = getToken();
    const user = getUser();
    if (!token || user?.role !== "ADMIN") {
      router.replace("/admin/login");
    }
  }, [pathname, isLoginPage, router]);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a14", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#6b7280", fontSize: "14px" }}>Loading...</div>
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a14" }}>
      <Sidebar />
      <div style={{ marginLeft: "220px", flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ marginTop: "60px", padding: "32px", flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}