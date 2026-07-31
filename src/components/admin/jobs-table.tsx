"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  App,
  Button,
  Card,
  DatePicker,
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
import dayjs from "dayjs";
import { upsertJob, removeJob, setJobPublished, type JobInput } from "@/app/admin/actions";
import { PageHeader } from "./page-header";

export type JobRow = {
  id: string;
  title: string;
  category: string;
  country: string;
  vacancies: number;
  salary: string;
  workingHours: string;
  contract: string;
  experience: string;
  accommodation: boolean;
  deadline: string | null;
  documents: string[];
  published: boolean;
};

export function JobsTable({ jobs }: { jobs: JobRow[] }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ vacancies: 1, accommodation: false, published: true });
    setOpen(true);
  }

  function openEdit(job: JobRow) {
    setEditingId(job.id);
    form.setFieldsValue({
      ...job,
      deadline: job.deadline ? dayjs(job.deadline) : null,
    });
    setOpen(true);
  }

  async function submit() {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const input: JobInput = {
        id: editingId ?? undefined,
        title: values.title,
        category: values.category,
        country: values.country,
        vacancies: values.vacancies ?? 1,
        salary: values.salary ?? "",
        workingHours: values.workingHours ?? "",
        contract: values.contract ?? "",
        experience: values.experience ?? "",
        accommodation: !!values.accommodation,
        deadline: values.deadline ? values.deadline.toISOString() : null,
        documents: values.documents ?? [],
        published: !!values.published,
      };
      await upsertJob(input);
      message.success(editingId ? "Job updated" : "Job created");
      setOpen(false);
      router.refresh();
    } catch {
      message.error("Could not save the job");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    await removeJob(id);
    message.success("Job deleted");
    router.refresh();
  }

  async function onTogglePublish(id: string, next: boolean) {
    await setJobPublished(id, next);
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle={`${jobs.length} listings`}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>
            New job
          </Button>
        }
      />

      <Card styles={{ body: { padding: 0 } }}>
      <Table<JobRow>
        rowKey="id"
        dataSource={jobs}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        scroll={{ x: "max-content" }}
        columns={[
          {
            title: "Title",
            dataIndex: "title",
            render: (_, r) => (
              <div>
                <div style={{ fontWeight: 500 }}>{r.title}</div>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>{r.category}</Typography.Text>
              </div>
            ),
          },
          { title: "Country", dataIndex: "country" },
          { title: "Vac.", dataIndex: "vacancies", width: 70 },
          {
            title: "Status",
            dataIndex: "published",
            render: (published: boolean, r) => (
              <Space>
                <Switch size="small" checked={published} onChange={(v) => onTogglePublish(r.id, v)} />
                <Tag color={published ? "green" : "default"}>{published ? "Published" : "Draft"}</Tag>
              </Space>
            ),
          },
          {
            title: "Actions",
            key: "actions",
            align: "right",
            render: (_, r) => (
              <Space>
                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
                <Popconfirm title="Delete this job?" onConfirm={() => onDelete(r.id)} okText="Delete" okButtonProps={{ danger: true }}>
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      </Card>

      <Modal
        title={editingId ? "Edit job" : "New job"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
        confirmLoading={saving}
        okText={editingId ? "Save changes" : "Create job"}
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="title" label="Job title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="country" label="Country" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="vacancies" label="Vacancies">
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="salary" label="Salary">
              <Input />
            </Form.Item>
            <Form.Item name="workingHours" label="Working hours">
              <Input />
            </Form.Item>
            <Form.Item name="contract" label="Contract">
              <Input />
            </Form.Item>
            <Form.Item name="experience" label="Experience">
              <Input />
            </Form.Item>
            <Form.Item name="deadline" label="Application deadline">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <Form.Item name="documents" label="Required documents">
            <Select mode="tags" placeholder="Type and press enter (e.g. Valid passport)" open={false} />
          </Form.Item>
          <Space size="large">
            <Form.Item name="accommodation" label="Accommodation" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="published" label="Published" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
