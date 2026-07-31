"use client";

import { App, Card, List, Select, Typography } from "antd";
import { useRouter } from "next/navigation";
import { updateStatus } from "@/app/admin/actions";
import { PageHeader } from "./page-header";

export type MessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
};

const STATUSES = ["new", "read", "replied", "closed"];

export function MessagesView({ rows }: { rows: MessageRow[] }) {
  const router = useRouter();
  const { message } = App.useApp();

  async function change(id: string, status: string) {
    await updateStatus("message", id, status);
    message.success("Status updated");
    router.refresh();
  }

  return (
    <div>
      <PageHeader title="Messages" subtitle={`${rows.length} total`} />

      <List
        dataSource={rows}
        locale={{ emptyText: "No messages yet." }}
        renderItem={(m) => (
          <Card size="small" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 500 }}>
                  {m.name}
                  {m.subject && <Typography.Text type="secondary"> — {m.subject}</Typography.Text>}
                </div>
                <div style={{ fontSize: 12, color: "#8a8a8a", marginTop: 2 }}>
                  <a href={`mailto:${m.email}`}>{m.email}</a>
                  {m.phone && <> · {m.phone}</>}
                  <> · {new Date(m.createdAt).toLocaleDateString("en-GB")}</>
                </div>
              </div>
              <Select
                size="small"
                value={m.status}
                style={{ width: 120 }}
                onChange={(v) => change(m.id, v)}
                options={STATUSES.map((s) => ({ value: s, label: s }))}
              />
            </div>
            <Typography.Paragraph style={{ marginTop: 10, marginBottom: 0, whiteSpace: "pre-wrap" }}>
              {m.message}
            </Typography.Paragraph>
          </Card>
        )}
      />
    </div>
  );
}
