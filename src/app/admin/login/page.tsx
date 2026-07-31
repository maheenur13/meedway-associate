import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session) redirect("/admin");
  const settings = await getSettings();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "#f5f6f8",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span
            style={{
              display: "inline-flex",
              height: 44,
              width: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              background: "#1d4ed8",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {settings.shortName.trim().charAt(0).toUpperCase() || "M"}
          </span>
          <h1
            style={{
              marginTop: 12,
              marginBottom: 2,
              fontSize: 20,
              fontWeight: 600,
              color: "#0a0a0a",
            }}
          >
            {settings.shortName} Admin
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "#8a8a8a" }}>
            Sign in to manage the site
          </p>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid #ececec",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
