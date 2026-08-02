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
  upsertTradeCategory,
  removeTradeCategory,
  setTradeCategoryPublished,
  type TradeCategoryInput,
} from "@/app/admin/actions";
import { TRADE_ICON_NAMES, tradeIcon, DEFAULT_TRADE_ICON } from "@/lib/trade-icons";
import { PageHeader } from "./page-header";

export type TradeRow = {
  id: string;
  nameEn: string;
  nameBn: string;
  icon: string;
  sortOrder: number;
  published: boolean;
};

/** Renders the actual lucide icon so the admin picks by sight, not by name. */
function IconPreview({ name, className }: { name: string; className?: string }) {
  const Icon = tradeIcon(name);
  return <Icon className={className} size={18} />;
}

export function TradesTable({ trades }: { trades: TradeRow[] }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      icon: DEFAULT_TRADE_ICON,
      // Land new rows at the end of the grid rather than jumbled into it.
      sortOrder: (trades.at(-1)?.sortOrder ?? 0) + 10,
      published: true,
    });
    setOpen(true);
  }

  function openEdit(row: TradeRow) {
    setEditingId(row.id);
    form.setFieldsValue(row);
    setOpen(true);
  }

  async function submit() {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const input: TradeCategoryInput = {
        id: editingId ?? undefined,
        nameEn: values.nameEn,
        nameBn: values.nameBn ?? "",
        icon: values.icon ?? DEFAULT_TRADE_ICON,
        sortOrder: values.sortOrder ?? 0,
        published: !!values.published,
      };
      const res = await upsertTradeCategory(input);
      if (!res.ok) {
        message.error(res.error ?? "Could not save the trade");
        return;
      }
      message.success(editingId ? "Trade updated" : "Trade added");
      setOpen(false);
      router.refresh();
    } catch {
      message.error("Could not save the trade");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    await removeTradeCategory(id);
    message.success("Trade deleted");
    router.refresh();
  }

  async function onTogglePublish(id: string, next: boolean) {
    await setTradeCategoryPublished(id, next);
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Trades"
        subtitle={`${trades.length} categories in the homepage "What we provide" grid`}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>
            New trade
          </Button>
        }
      />

      <Card styles={{ body: { padding: 0 } }}>
        <Table
          rowKey="id"
          dataSource={trades}
          pagination={false}
          scroll={{ x: 720 }}
          columns={[
            {
              title: "",
              dataIndex: "icon",
              width: 56,
              align: "center",
              render: (icon: string) => <IconPreview name={icon} />,
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
                v ? (
                  v
                ) : (
                  <Typography.Text type="secondary">Uses English</Typography.Text>
                ),
            },
            { title: "Order", dataIndex: "sortOrder", width: 90, align: "right" },
            {
              title: "Shown",
              dataIndex: "published",
              width: 110,
              render: (published: boolean, r) => (
                <Space>
                  <Switch
                    size="small"
                    checked={published}
                    onChange={(v) => onTogglePublish(r.id, v)}
                  />
                  {published ? (
                    <Tag color="green">Live</Tag>
                  ) : (
                    <Tag>Hidden</Tag>
                  )}
                </Space>
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
                    title="Delete this trade?"
                    description="It will disappear from the homepage grid."
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => onDelete(r.id)}
                  >
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      aria-label={`Delete ${r.nameEn}`}
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
        title={editingId ? "Edit trade" : "New trade"}
        onCancel={() => setOpen(false)}
        onOk={submit}
        confirmLoading={saving}
        okText="Save"
        centered
        styles={{ body: { maxHeight: "calc(100vh - 220px)", overflowY: "auto", paddingRight: 8 } }}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="nameEn"
            label="Name (English)"
            rules={[{ required: true, message: "An English name is required" }]}
          >
            <Input placeholder="Construction" />
          </Form.Item>

          <Form.Item
            name="nameBn"
            label="Name (Bengali)"
            extra="Leave blank to show the English name on the Bengali site."
          >
            <Input placeholder="নির্মাণ" />
          </Form.Item>

          <Form.Item name="icon" label="Icon">
            <Select
              showSearch
              options={TRADE_ICON_NAMES.map((name) => ({
                value: name,
                label: (
                  <Space>
                    <IconPreview name={name} />
                    {name}
                  </Space>
                ),
              }))}
            />
          </Form.Item>

          <Form.Item
            name="sortOrder"
            label="Order"
            extra="Lower numbers appear first. Leave gaps (10, 20, 30) so items are easy to move later."
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
