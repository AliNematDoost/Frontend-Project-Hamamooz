import { useEffect } from "react";
import { Form, Input, Modal, Typography } from "antd";

const { Text } = Typography;

export default function BackupFormModal({ open, loading, onCreate, onCancel }) {
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
      title="Run Backup"
      okText="Start Backup"
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
          name="sourcePath"
          label="Source Path"
          rules={[
            { required: true, message: "Please enter the path to back up" },
          ]}
        >
          <Input placeholder="/var/lib/mysql" />
        </Form.Item>

        <Text type="secondary" className="modal-form-hint">
          Runs immediately against this path inside the app's pod.
        </Text>
      </Form>
    </Modal>
  );
}
