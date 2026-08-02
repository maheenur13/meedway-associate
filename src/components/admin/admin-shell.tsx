"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Layout, Menu, Grid, Drawer, Button, Dropdown, Avatar } from "antd";
import {
  DashboardOutlined,
  SolutionOutlined,
  TeamOutlined,
  BankOutlined,
  MailOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  SettingOutlined,
  MenuOutlined,
  LogoutOutlined,
  ExportOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { signOutAction } from "@/app/admin/actions";

const { Header, Sider, Content } = Layout;

const items = [
  { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/admin/jobs", icon: <SolutionOutlined />, label: "Jobs" },
  { key: "/admin/trades", icon: <AppstoreOutlined />, label: "Trades" },
  { key: "/admin/reach", icon: <GlobalOutlined />, label: "Global Reach" },
  { key: "/admin/applications", icon: <TeamOutlined />, label: "Applications" },
  { key: "/admin/requests", icon: <BankOutlined />, label: "Worker Requests" },
  { key: "/admin/messages", icon: <MailOutlined />, label: "Messages" },
  { key: "/admin/content", icon: <SettingOutlined />, label: "Site Content" },
];

function SideNav({
  selectedKey,
  onNavigate,
  brandName,
}: {
  selectedKey: string;
  onNavigate: (key: string) => void;
  brandName?: string;
}) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "18px 18px 16px",
          color: "#fff",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          marginBottom: 8,
        }}
      >
        {/* The real company mark, not an initial in a box. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/photos/logo-mark.png"
          alt=""
          width={30}
          height={30}
          style={{ flexShrink: 0 }}
        />
        {/* minWidth:0 lets the name actually truncate inside the flex row —
            "Meed Associate Ltd Admin" used to wrap onto two ragged lines. */}
        <div style={{ minWidth: 0, lineHeight: 1.2 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={brandName}
          >
            {brandName || "Meed Associate"}
          </div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              marginTop: 2,
            }}
          >
            Admin
          </div>
        </div>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={items}
        onClick={({ key }) => onNavigate(key)}
        style={{ flex: 1, borderInlineEnd: 0, background: "transparent" }}
      />
    </div>
  );
}

export function AdminShell({
  email,
  brandName,
  children,
}: {
  email?: string | null;
  brandName?: string;
  children: ReactNode;
}) {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const selectedKey =
    items
      .filter((i) => (i.key === "/admin" ? pathname === "/admin" : pathname.startsWith(i.key)))
      .sort((a, b) => b.key.length - a.key.length)[0]?.key ?? "/admin";

  // Every admin page is force-dynamic (they must show live data), so each
  // navigation is a server round-trip. Without a transition the UI sits
  // completely still while that happens and the click feels ignored.
  const navigate = (key: string) => {
    setDrawerOpen(false);
    startTransition(() => router.push(key));
  };

  const userMenu = {
    items: [
      { key: "site", icon: <ExportOutlined />, label: "View site" },
      { type: "divider" as const },
      { key: "signout", icon: <LogoutOutlined />, label: "Sign out", danger: true },
    ],
    onClick: async ({ key }: { key: string }) => {
      if (key === "site") window.open("/", "_blank");
      if (key === "signout") await signOutAction();
    },
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile && (
        <Sider width={232} style={{ background: "#0a1226" }}>
          <SideNav
            selectedKey={selectedKey}
            onNavigate={navigate}
            brandName={brandName}
          />
        </Sider>
      )}

      {isMobile && (
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          styles={{
            body: { padding: 0, background: "#0a1226" },
            header: { display: "none" },
            wrapper: { width: 240 },
          }}
        >
          <SideNav
            selectedKey={selectedKey}
            onNavigate={navigate}
            brandName={brandName}
          />
        </Drawer>
      )}

      <Layout>
        <Header
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 16px",
            background: "#fff",
            borderBottom: "1px solid #ececec",
          }}
        >
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            />
          )}
          {/* Name the page you're on — "Admin" told you nothing you didn't
              already know from the sidebar. */}
          <div style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>
            {items.find((i) => i.key === selectedKey)?.label ?? "Admin"}
          </div>
          <Dropdown menu={userMenu} trigger={["click"]}>
            <Button type="text" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar size="small" icon={<UserOutlined />} />
              {!isMobile && (
                <span style={{ color: "#5a5a5a", fontSize: 13 }}>{email}</span>
              )}
            </Button>
          </Dropdown>

          {/* Indeterminate bar along the bottom edge of the header while a
              navigation is in flight. Indeterminate because the server gives
              no progress to report — it only has to prove the click landed. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -1,
              height: 2,
              overflow: "hidden",
              opacity: pending ? 1 : 0,
              transition: "opacity 150ms",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "40%",
                background: "#302878",
                animation: "admin-progress 1.1s ease-in-out infinite",
              }}
            />
          </div>
        </Header>
        {/* Background comes from the theme's colorBgLayout rather than being
            hardcoded, so it stays in step with the token set. */}
        {/* Dim the outgoing page while the next one loads, so a slow route
            reads as "working" rather than "frozen". */}
        <Content style={{ padding: isMobile ? 16 : 28 }}>
          <div
            style={{
              maxWidth: 1140,
              margin: "0 auto",
              opacity: pending ? 0.55 : 1,
              transition: "opacity 150ms",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
