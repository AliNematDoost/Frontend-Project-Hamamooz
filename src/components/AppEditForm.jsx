import { Button, Form, Input, InputNumber, Space } from "antd";

export default function AppEditForm({ app, loading, onSave, onCancel }) {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    await onSave(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        replicas: app.replicas,
        cpu: app.cpu.replace("m", ""),
        memory: app.memory,
      }}
      onFinish={handleSubmit}
    >
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
          style={{
            width: "100%",
          }}
          min={1}
        />
      </Form.Item>

      <Form.Item
        name="cpu"
        label="CPU (millicores)"
        rules={[
          {
            required: true,
            message: "Please enter CPU",
          },
        ]}
      >
        <Input addonAfter="m" placeholder="500" />
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
        <Input placeholder="512Mi" />
      </Form.Item>

      <Space>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save Changes
        </Button>

        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </Space>
    </Form>
  );
}