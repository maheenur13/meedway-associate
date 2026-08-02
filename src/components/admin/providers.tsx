"use client";

import { ConfigProvider, App, theme as antdTheme } from "antd";
import type { ReactNode } from "react";

export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#302878",
          colorLink: "#302878",
          borderRadius: 8,
          fontFamily:
            "var(--font-inter), system-ui, -apple-system, sans-serif",
        },
        components: {
          Layout: {
            siderBg: "#0f1115",
            triggerBg: "#0f1115",
            headerBg: "#ffffff",
          },
          Menu: {
            darkItemBg: "#0f1115",
            darkSubMenuItemBg: "#0f1115",
            darkItemSelectedBg: "#302878",
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
