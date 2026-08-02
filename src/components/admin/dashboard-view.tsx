"use client";

import { Card, Col, Row, Statistic, Table, Typography } from "antd";
import {
  SolutionOutlined,
  TeamOutlined,
  BankOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { PageHeader } from "./page-header";

type Recent = {
  id: string;
  fullName: string;
  position: string | null;
  country: string | null;
  createdAt: string;
};

const cardsMeta = [
  { key: "jobs", label: "Jobs", href: "/admin/jobs", icon: <SolutionOutlined />, color: "#302878", bg: "#e9e7f7" },
  { key: "applications", label: "Applications", href: "/admin/applications", icon: <TeamOutlined />, color: "#0f766e", bg: "#d9f2ee" },
  { key: "requests", label: "Worker Requests", href: "/admin/requests", icon: <BankOutlined />, color: "#b45309", bg: "#fbecd6" },
  { key: "messages", label: "Messages", href: "/admin/messages", icon: <MailOutlined />, color: "#7c3aed", bg: "#eee7fd" },
] as const;

export function DashboardView({
  counts,
  recent,
}: {
  counts: { jobs: number; applications: number; requests: number; messages: number };
  recent: Recent[];
}) {
  const router = useRouter();

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your site activity." />

      <Row gutter={[16, 16]}>
        {cardsMeta.map((c) => (
          <Col xs={12} lg={6} key={c.key}>
            <Card
              hoverable
              onClick={() => router.push(c.href)}
              styles={{ body: { padding: 20 } }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{
                    display: "inline-flex",
                    height: 46,
                    width: 46,
                    flexShrink: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    background: c.bg,
                    color: c.color,
                    fontSize: 20,
                  }}
                >
                  {c.icon}
                </span>
                <Statistic
                  title={c.label}
                  value={counts[c.key]}
                  styles={{ content: { fontWeight: 600 } }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        title="Recent applications"
        style={{ marginTop: 20 }}
        styles={{ body: { padding: 0 } }}
      >
        <Table<Recent>
          rowKey="id"
          dataSource={recent}
          pagination={false}
          scroll={{ x: "max-content" }}
          locale={{ emptyText: "No applications yet." }}
          columns={[
            { title: "Applicant", dataIndex: "fullName", render: (v) => <span style={{ fontWeight: 500 }}>{v}</span> },
            { title: "Position", dataIndex: "position", render: (v) => v ?? "—" },
            { title: "Country", dataIndex: "country", render: (v) => v ?? "—" },
            {
              title: "Date",
              dataIndex: "createdAt",
              align: "right",
              render: (v: string) => (
                <Typography.Text type="secondary">
                  {new Date(v).toLocaleDateString("en-GB")}
                </Typography.Text>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
