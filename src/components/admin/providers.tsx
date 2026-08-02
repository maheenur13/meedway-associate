"use client";

import { ConfigProvider, App, theme as antdTheme } from "antd";
import type { ReactNode } from "react";

/**
 * Ant Design mapped onto the site's design tokens (see globals.css) so the
 * admin reads as the same product rather than a stock dashboard. Values are
 * the literal hexes, not var() — Ant computes derived colours (hovers, active
 * states, borders) from these and cannot do that with CSS variables.
 */
export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#302878", // --accent, the logo indigo
          colorLink: "#302878",
          colorInfo: "#302878",
          colorSuccess: "#2e9e6b", // --success
          colorError: "#d64545", // --danger
          colorText: "#0a0a0a", // --ink
          colorTextSecondary: "#5a5a5a", // --ink-soft
          colorTextTertiary: "#8a8a8a", // --ink-mute
          colorBorder: "#dcdcd8", // --line-2
          colorBorderSecondary: "#ececec", // --line
          colorBgLayout: "#f4f4f2", // a touch darker than --paper so cards lift
          borderRadius: 10,
          borderRadiusLG: 14,
          controlHeight: 36,
          fontSize: 14,
          fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
        },
        components: {
          Layout: {
            siderBg: "#0a1226", // --panel, same navy as the site footer
            triggerBg: "#0a1226",
            headerBg: "#ffffff",
            headerHeight: 60,
          },
          Menu: {
            darkItemBg: "transparent",
            darkSubMenuItemBg: "transparent",
            darkItemSelectedBg: "#302878",
            darkItemHoverBg: "rgba(255,255,255,0.06)",
            darkItemColor: "rgba(255,255,255,0.72)",
            darkItemSelectedColor: "#ffffff",
            itemMarginInline: 10,
            itemHeight: 40,
            iconSize: 15,
          },
          Card: { paddingLG: 20 },
          Table: {
            headerBg: "#fafafa",
            headerColor: "#5a5a5a",
            rowHoverBg: "#f7f7fb",
            cellPaddingBlock: 14,
          },
          Button: { fontWeight: 500 },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
