"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    const logout = async () => {
      try {
        const token = localStorage.getItem("token");

        await fetch("http://localhost:3000/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Logout request failed:", err);
      }

      // Clear auth
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Wait 1.5s before redirecting to home
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    };

    logout();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal */}
      <div className="bg-[#0F172A] border border-white/10 rounded-2xl px-8 py-6 flex flex-col items-center gap-4 shadow-xl">
        {/* Spinner */}
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-gray-300 text-sm">Logging you out...</p>
      </div>
    </div>
  );
}
