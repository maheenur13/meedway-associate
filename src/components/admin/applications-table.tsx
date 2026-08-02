"use client";

import { App, Button, Card, Popconfirm, Select, Table, Typography } from "antd";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { updateStatus, removeApplication } from "@/app/admin/actions";
import { PageHeader } from "./page-header";

export type AppRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string | null;
  country: string | null;
  cvPath: string | null;
  status: string;
  createdAt: string;
};

const STATUSES = ["new", "reviewed", "shortlisted", "rejected"];

export function ApplicationsTable({ rows }: { rows: AppRow[] }) {
  const router = useRouter();
  const { message } = App.useApp();

  async function change(id: string, status: string) {
    await updateStatus("application", id, status);
    message.success("Status updated");
    router.refresh();
  }

  async function onDelete(id: string) {
    await removeApplication(id);
    message.success("Application deleted");
    router.refresh();
  }

  return (
    <div>
      <PageHeader title="Applications" subtitle={`${rows.length} total`} />
      <Card styles={{ body: { padding: 0 } }}>
      <Table<AppRow>
        rowKey="id"
        dataSource={rows}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 12, hideOnSinglePage: true }}
        columns={[
          {
            title: "Applicant",
            render: (_, r) => (
              <div>
                <div style={{ fontWeight: 500 }}>{r.fullName}</div>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>{r.country ?? "—"}</Typography.Text>
              </div>
            ),
          },
          { title: "Position", dataIndex: "position", render: (v) => v ?? "—" },
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
            title: "CV",
            dataIndex: "cvPath",
            render: (cv: string | null) =>
              cv ? (
                <a href={cv} target="_blank" rel="noopener noreferrer">
                  <DownloadOutlined /> CV
                </a>
              ) : (
                "—"
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
          {
            title: "",
            key: "actions",
            align: "right",
            width: 60,
            render: (_, r) => (
              <Popconfirm
                title="Delete this application?"
                description={
                  r.cvPath
                    ? "The applicant's details and their uploaded CV are removed permanently."
                    : "The applicant's details are removed permanently."
                }
                okText="Delete"
                okButtonProps={{ danger: true }}
                onConfirm={() => onDelete(r.id)}
              >
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={`Delete application from ${r.fullName}`}
                />
              </Popconfirm>
            ),
          },
        ]}
      />
      </Card>
    </div>
  );
}
