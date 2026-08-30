import { useEffect } from "react";
import { Form, Input, InputNumber, Modal } from "antd";

export default function AppFormModal({ open, loading, onCreate, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    await onCreate(values);
  };

  return (
    <Modal
      open={open}
      title="Create App"
      okText="Create"
      confirmLoading={loading}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          replicas: 1,
          cpu: "250m",
          memory: "256Mi",
        }}
      >
        <Form.Item
          name="name"
          label="App Name"
          rules={[
            {
              required: true,
              message: "Please enter an app name",
            },
          ]}
        >
          <Input placeholder="my-app" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Image"
          rules={[
            {
              required: true,
              message: "Please enter an image",
            },
          ]}
        >
          <Input placeholder="nginx:latest" />
        </Form.Item>

        <Form.Item
          name="replicas"
          label="Replicas"
          rules={[
            {
              required: true,
              message: "Please enter the number of replicas",
            },
            {
              type: "number",
              min: 1,
              message: "Replicas must be at least 1",
            },
          ]}
        >
          <InputNumber
            min={1}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        <Form.Item
          name="cpu"
          label="CPU"
          rules={[
            {
              required: true,
              message: "Please enter CPU",
            },
          ]}
        >
          <Input placeholder="250m" />
        </Form.Item>

        <Form.Item
          name="memory"
          label="Memory"
          rules={[
            {
              required: true,
              message: "Please enter memory",
            },
          ]}
        >
          <Input placeholder="256Mi" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
