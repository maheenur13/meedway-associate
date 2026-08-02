"use client";

import { useState, type ReactNode } from "react";
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
          padding: "18px 20px",
          color: "#fff",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            height: 30,
            width: 30,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            background: "#302878",
            fontWeight: 700,
          }}
        >
          {brandName?.trim().charAt(0).toUpperCase() || "M"}
        </span>
        <span style={{ fontWeight: 600, fontSize: 15 }}>
          {brandName ? `${brandName} Admin` : "Admin"}
        </span>
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
  const pathname = usePathname();
  const router = useRouter();

  const selectedKey =
    items
      .filter((i) => (i.key === "/admin" ? pathname === "/admin" : pathname.startsWith(i.key)))
      .sort((a, b) => b.key.length - a.key.length)[0]?.key ?? "/admin";

  const navigate = (key: string) => {
    router.push(key);
    setDrawerOpen(false);
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
        <Sider width={232} style={{ background: "#0f1115" }}>
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
            body: { padding: 0, background: "#0f1115" },
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
          <div style={{ flex: 1, fontWeight: 600 }}>Admin</div>
          <Dropdown menu={userMenu} trigger={["click"]}>
            <Button type="text" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar size="small" icon={<UserOutlined />} />
              {!isMobile && (
                <span style={{ color: "#5a5a5a", fontSize: 13 }}>{email}</span>
              )}
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ padding: isMobile ? 16 : 24, background: "#f0f2f5" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
