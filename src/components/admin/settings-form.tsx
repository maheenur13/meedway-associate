"use client";

import { App, Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSettings } from "@/app/admin/actions";
import { PageHeader } from "./page-header";

type Values = Record<string, string>;

const fields: { name: string; label: string; full?: boolean }[] = [
  { name: "name", label: "Company name" },
  { name: "licence", label: "Recruiting licence no." },
  { name: "md", label: "Managing Director" },
  { name: "address", label: "Office address", full: true },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email" },
  { name: "whatsapp", label: "WhatsApp (digits only)" },
  { name: "hours", label: "Office hours" },
];

export function SettingsForm({ initial }: { initial: Values }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [saving, setSaving] = useState(false);

  async function onFinish(values: Values) {
    setSaving(true);
    try {
      await updateSettings(values);
      message.success("Saved");
      router.refresh();
    } catch {
      message.error("Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <PageHeader
        title="Site Content"
        subtitle="Company details shown across the site (footer, contact, WhatsApp)."
      />

      <Card>
        <Form layout="vertical" initialValues={initial} onFinish={onFinish}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {fields.map((f) => (
              <Form.Item
                key={f.name}
                name={f.name}
                label={f.label}
                style={f.full ? { gridColumn: "1 / -1" } : undefined}
              >
                <Input />
              </Form.Item>
            ))}
          </div>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save changes
          </Button>
        </Form>
      </Card>

      <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 16 }}>
        Note: editing full page text (About / Services) and worker counts is a future
        enhancement. These company fields are live now.
      </Typography.Paragraph>
    </div>
  );
}
