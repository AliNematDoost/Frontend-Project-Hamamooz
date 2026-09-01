import { useEffect } from "react";
import { Form, Input, Modal } from "antd";

export default function ClusterFormModal({
  open,
  loading,
  onCreate,
  onCancel,
}) {
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
      title="Create Cluster"
      okText="Create"
      confirmLoading={loading}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="name"
          label="Cluster Name"
          rules={[{ required: true, message: "Please enter a cluster name" }]}
        >
          <Input placeholder="production-eu" />
        </Form.Item>

        <Form.Item
          name="address"
          label="API Server Address"
          rules={[
            {
              required: true,
              message: "Please enter the cluster's API address",
            },
          ]}
        >
          <Input placeholder="https://10.0.0.5:6443" />
        </Form.Item>

        <Form.Item
          name="token"
          label="Service Account Token"
          rules={[{ required: true, message: "Please enter a token" }]}
        >
          <Input.Password
            placeholder="eyJhbGciOi..."
            autoComplete="new-password"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
