"use client";

import { App, Button, Card, Form, Input, Tag, Typography } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSettings, type SettingsInput } from "@/app/admin/actions";
import {
  GROUP_LABELS,
  SETTING_FIELDS,
  type FieldDef,
  type FieldGroup,
} from "@/lib/settings-fields";
import { PageHeader } from "./page-header";

type Pair = { en: string; bn: string };
type Values = Record<string, Pair>;

const GROUP_ORDER: FieldGroup[] = ["brand", "contact", "social", "stats"];

function FieldRow({
  field,
  placeholder,
}: {
  field: FieldDef;
  placeholder?: Pair;
}) {
  const Control = field.multiline ? Input.TextArea : Input;
  const rows = field.multiline ? 2 : undefined;

  return (
    <div style={{ marginBottom: 4 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: field.localized ? "1fr 1fr" : "1fr",
          gap: 12,
        }}
      >
        <Form.Item
          name={[field.key, "en"]}
          label={
            <span>
              {field.label}
              {field.localized && <Tag style={{ marginLeft: 8 }}>EN</Tag>}
            </span>
          }
          style={{ marginBottom: 8 }}
        >
          <Control rows={rows} placeholder={placeholder?.en} allowClear />
        </Form.Item>

        {field.localized && (
          <Form.Item
            name={[field.key, "bn"]}
            label={
              <span>
                {field.label} <Tag color="blue">বাংলা</Tag>
              </span>
            }
            style={{ marginBottom: 8 }}
          >
            <Control rows={rows} placeholder={placeholder?.bn} allowClear />
          </Form.Item>
        )}
      </div>

      {field.hint && (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {field.hint}
        </Typography.Text>
      )}
    </div>
  );
}

export function SettingsForm({
  initial,
  placeholders,
}: {
  initial: Values;
  placeholders: Record<string, Pair>;
}) {
  const router = useRouter();
  const { message } = App.useApp();
  const [saving, setSaving] = useState(false);

  async function onFinish(values: SettingsInput) {
    setSaving(true);
    try {
      await updateSettings(values);
      message.success("Saved — the site updates immediately");
      router.refresh();
    } catch {
      message.error("Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <PageHeader
        title="Site Content"
        subtitle="Everything here is live on the public site — navbar, footer, contact page and homepage counters."
      />

      <Form layout="vertical" initialValues={initial} onFinish={onFinish}>
        {GROUP_ORDER.map((group) => {
          const fields = SETTING_FIELDS.filter((f) => f.group === group);
          if (fields.length === 0) return null;
          return (
            <Card
              key={group}
              title={GROUP_LABELS[group].title}
              style={{ marginBottom: 16 }}
            >
              <Typography.Paragraph type="secondary" style={{ fontSize: 13, marginTop: -4 }}>
                {GROUP_LABELS[group].subtitle}
              </Typography.Paragraph>
              {fields.map((f) => (
                <FieldRow key={f.key} field={f} placeholder={placeholders[f.key]} />
              ))}
            </Card>
          );
        })}

        <Button type="primary" htmlType="submit" loading={saving} size="large">
          Save changes
        </Button>
      </Form>

      <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 16 }}>
        Leave a field blank to use the built-in default (shown greyed out in the box).
        Fields tagged <Tag>EN</Tag>/<Tag color="blue">বাংলা</Tag> can differ per language —
        if you fill in only English, the Bengali site uses the English text too.
      </Typography.Paragraph>
    </div>
  );
}
