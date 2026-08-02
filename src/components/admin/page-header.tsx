"use client";

import { Typography } from "antd";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  extra,
}: {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 20,
      }}
    >
      <div>
        {/* Sora + tight tracking, matching the public site's headings. */}
        <Typography.Title
          level={3}
          style={{
            margin: 0,
            fontWeight: 600,
            fontFamily: "var(--font-sora), var(--font-inter), sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography.Title>
        {subtitle && (
          <Typography.Text type="secondary">{subtitle}</Typography.Text>
        )}
      </div>
      {extra && <div>{extra}</div>}
    </div>
  );
}
