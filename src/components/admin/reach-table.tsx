"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  App,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  upsertReachCountry,
  removeReachCountry,
  setReachCountryPublished,
  type ReachCountryInput,
} from "@/app/admin/actions";
import { REACH_CODES } from "@/lib/reach-map";
import { PageHeader } from "./page-header";

export type ReachRow = {
  id: string;
  code: string;
  nameEn: string;
  nameBn: string;
  workers: number;
  pill: boolean;
  sortOrder: number;
  published: boolean;
};

function Flag({ code }: { code: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/32x24/${code}.png`}
      alt=""
      width={20}
      height={15}
      style={{ borderRadius: 3, objectFit: "cover" }}
    />
  );
}

export function ReachTable({ rows }: { rows: ReachRow[] }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const used = new Set(rows.map((r) => r.code));
  const total = rows
    .filter((r) => r.published)
    .reduce((sum, r) => sum + r.workers, 0);

  function openNew() {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      workers: 0,
      pill: false,
      sortOrder: (rows.at(-1)?.sortOrder ?? 0) + 10,
      published: true,
    });
    setOpen(true);
  }

  function openEdit(row: ReachRow) {
    setEditingId(row.id);
    form.setFieldsValue(row);
    setOpen(true);
  }

  async function submit() {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const input: ReachCountryInput = {
        id: editingId ?? undefined,
        code: values.code,
        nameEn: values.nameEn,
        nameBn: values.nameBn ?? "",
        workers: values.workers ?? 0,
        pill: !!values.pill,
        sortOrder: values.sortOrder ?? 0,
        published: !!values.published,
      };
      const res = await upsertReachCountry(input);
      if (!res.ok) {
        message.error(res.error ?? "Could not save the country");
        return;
      }
      message.success(editingId ? "Country updated" : "Country added");
      setOpen(false);
      router.refresh();
    } catch {
      message.error("Could not save the country");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    await removeReachCountry(id);
    message.success("Country removed");
    router.refresh();
  }

  async function onTogglePublish(id: string, next: boolean) {
    await setReachCountryPublished(id, next);
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Global reach"
        subtitle={`${rows.length} countries · ${total.toLocaleString()} workers shown on the homepage map`}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>
            New country
          </Button>
        }
      />

      <Card styles={{ body: { padding: 0 } }}>
        <Table
          rowKey="id"
          dataSource={rows}
          pagination={false}
          scroll={{ x: 820 }}
          columns={[
            {
              title: "",
              dataIndex: "code",
              width: 56,
              align: "center",
              render: (code: string) => <Flag code={code} />,
            },
            {
              title: "Name (English)",
              dataIndex: "nameEn",
              render: (v: string) => <Typography.Text strong>{v}</Typography.Text>,
            },
            {
              title: "Name (Bengali)",
              dataIndex: "nameBn",
              render: (v: string) =>
                v ? v : <Typography.Text type="secondary">Uses English</Typography.Text>,
            },
            {
              title: "Workers",
              dataIndex: "workers",
              width: 110,
              align: "right",
              render: (v: number) => v.toLocaleString(),
            },
            {
              title: "Map label",
              dataIndex: "pill",
              width: 110,
              render: (pill: boolean) =>
                pill ? <Tag color="gold">Callout</Tag> : <Tag>Pin only</Tag>,
            },
            { title: "Order", dataIndex: "sortOrder", width: 80, align: "right" },
            {
              title: "Shown",
              dataIndex: "published",
              width: 100,
              render: (published: boolean, r) => (
                <Switch
                  size="small"
                  checked={published}
                  onChange={(v) => onTogglePublish(r.id, v)}
                />
              ),
            },
            {
              title: "",
              key: "actions",
              width: 110,
              align: "right",
              render: (_, r) => (
                <Space>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => openEdit(r)}
                    aria-label={`Edit ${r.nameEn}`}
                  />
                  <Popconfirm
                    title="Remove this country?"
                    description="It disappears from the map and the legend."
                    okText="Remove"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => onDelete(r.id)}
                  >
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      aria-label={`Remove ${r.nameEn}`}
                    />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        open={open}
        title={editingId ? "Edit country" : "New country"}
        onCancel={() => setOpen(false)}
        onOk={submit}
        confirmLoading={saving}
        okText="Save"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="code"
            label="Country"
            rules={[{ required: true, message: "Pick a country" }]}
            extra="Only countries with a defined map position can be listed. Adding a new one needs a developer to supply its coordinates."
          >
            <Select
              showSearch
              disabled={!!editingId}
              options={REACH_CODES.map((code) => ({
                value: code,
                // Codes already on the list can't be added twice — `code` is unique.
                disabled: !editingId && used.has(code),
                label: (
                  <Space>
                    <Flag code={code} />
                    {code.toUpperCase()}
                  </Space>
                ),
              }))}
            />
          </Form.Item>

          <Form.Item
            name="nameEn"
            label="Name (English)"
            rules={[{ required: true, message: "An English name is required" }]}
          >
            <Input placeholder="Malaysia" />
          </Form.Item>

          <Form.Item
            name="nameBn"
            label="Name (Bengali)"
            extra="Leave blank to show the English name on the Bengali site."
          >
            <Input placeholder="মালয়েশিয়া" />
          </Form.Item>

          <Form.Item name="workers" label="Workers deployed">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="pill"
            label="Show a labelled callout on the map"
            valuePropName="checked"
            extra="Use sparingly — the Gulf pins sit close together and callouts overlap."
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="sortOrder"
            label="Order"
            extra="Lower numbers appear first in the legend."
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="published" label="Show on the site" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
