"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post("/api/admin/logout");
      } catch (error) {
        console.error("Logout failed", error);
      } finally {
        router.push("/admin/login");
        router.refresh(); // Clear client cache
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Logging out securely...</p>
    </div>
  );
}
