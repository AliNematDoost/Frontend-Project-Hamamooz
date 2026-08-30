import { useEffect } from "react";

import { Form, Input, Modal } from "antd";

export default function NamespaceFormModal({
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
      title="Create Namespace"
      okText="Create"
      confirmLoading={loading}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="name"
          label="Namespace name"
          rules={[
            {
              required: true,
              message: "Please enter a namespace name",
            },
          ]}
        >
          <Input placeholder="billing" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
