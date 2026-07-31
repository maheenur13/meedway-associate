"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { App, Button, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

export function LoginForm() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  async function onFinish(values: { email: string; password: string }) {
    setLoading(true);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      message.error("Invalid email or password.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
        <Input prefix={<UserOutlined />} placeholder="admin@meedassociates.com" size="large" />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block size="large" loading={loading}>
        Sign in
      </Button>
    </Form>
  );
}
