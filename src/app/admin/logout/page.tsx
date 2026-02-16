"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    // Clear cookie manually
    document.cookie = "admin-auth=; Max-Age=0; path=/";
    window.location.href = "/admin/login";
  }, []);

  return <p>Logging out...</p>;
}
