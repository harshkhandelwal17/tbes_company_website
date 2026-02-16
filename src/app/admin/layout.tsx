// app/admin/layout.tsx

import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside
        style={{
          width: "220px",
          background: "#111",
          color: "#fff",
          padding: "1.5rem",
          minHeight: "100vh",
        }}
      >
        <h2 style={{ marginBottom: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}>
          Admin Panel
        </h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link 
            href="/admin" 
            style={{ 
              color: "#ccc", 
              textDecoration: "none",
              padding: "0.5rem 0",
              borderRadius: "4px",
              transition: "background-color 0.2s"
            }}
          >
            🏠 Dashboard
          </Link>
          <Link 
            href="/admin/career" 
            style={{ 
              color: "#ccc", 
              textDecoration: "none",
              padding: "0.5rem 0",
              borderRadius: "4px",
              transition: "background-color 0.2s"
            }}
          >
            💼 Career
          </Link>
          <Link 
            href="/admin/projects" 
            style={{ 
              color: "#ccc", 
              textDecoration: "none",
              padding: "0.5rem 0",
              borderRadius: "4px",
              transition: "background-color 0.2s"
            }}
          >
            🖼️ Projects
          </Link>
          <Link 
            href="/admin/logout" 
            style={{ 
              color: "#ccc", 
              textDecoration: "none",
              padding: "0.5rem 0",
              borderRadius: "4px",
              transition: "background-color 0.2s"
            }}
          >
            🚪 Logout
          </Link>
        </nav>
      </aside>
      <main 
        style={{ 
          flex: 1, 
          padding: "2rem",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh"
        }}
      >
        {children}
      </main>
    </div>
  );
}