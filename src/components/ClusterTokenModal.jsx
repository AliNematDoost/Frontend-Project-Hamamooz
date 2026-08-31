import { useEffect } from "react";
import { Form, Input, Modal, Typography } from "antd";

const { Text } = Typography;

export default function ClusterTokenModal({
  open,
  loading,
  onUpdate,
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
    await onUpdate(values);
  };

  return (
    <Modal
      open={open}
      title="Update Cluster Token"
      okText="Update Token"
      confirmLoading={loading}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        className="modal-form"
      >
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

        <Text type="secondary" className="modal-form-hint">
          This replaces the cluster's stored access token. It is never shown
          again after saving.
        </Text>
      </Form>
    </Modal>
  );
}
