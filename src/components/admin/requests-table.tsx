"use client";

import { App, Card, Select, Table, Typography } from "antd";
import { useRouter } from "next/navigation";
import { updateStatus } from "@/app/admin/actions";
import { PageHeader } from "./page-header";

export type RequestRow = {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  country: string | null;
  category: string | null;
  quantity: string | null;
  status: string;
  createdAt: string;
};

const STATUSES = ["new", "contacted", "fulfilled", "closed"];

export function RequestsTable({ rows }: { rows: RequestRow[] }) {
  const router = useRouter();
  const { message } = App.useApp();

  async function change(id: string, status: string) {
    await updateStatus("request", id, status);
    message.success("Status updated");
    router.refresh();
  }

  return (
    <div>
      <PageHeader title="Worker Requests" subtitle={`${rows.length} total`} />
      <Card styles={{ body: { padding: 0 } }}>
      <Table<RequestRow>
        rowKey="id"
        dataSource={rows}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 12, hideOnSinglePage: true }}
        columns={[
          {
            title: "Company",
            render: (_, r) => (
              <div>
                <div style={{ fontWeight: 500 }}>{r.company}</div>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>{r.contact}</Typography.Text>
              </div>
            ),
          },
          {
            title: "Need",
            render: (_, r) =>
              [r.quantity, r.category, r.country].filter(Boolean).join(" · ") || "—",
          },
          {
            title: "Contact",
            render: (_, r) => (
              <div>
                <a href={`mailto:${r.email}`}>{r.email}</a>
                <div style={{ fontSize: 12, color: "#8a8a8a" }}>{r.phone}</div>
              </div>
            ),
          },
          {
            title: "Status",
            dataIndex: "status",
            render: (status: string, r) => (
              <Select
                size="small"
                value={status}
                style={{ width: 130 }}
                onChange={(v) => change(r.id, v)}
                options={STATUSES.map((s) => ({ value: s, label: s }))}
              />
            ),
          },
          {
            title: "Date",
            dataIndex: "createdAt",
            align: "right",
            render: (v: string) => new Date(v).toLocaleDateString("en-GB"),
          },
        ]}
      />
      </Card>
    </div>
  );
}
