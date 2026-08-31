import { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";

const PRESETS = [
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every 6 hours", value: "0 */6 * * *" },
  { label: "Every day at 2:00 AM", value: "0 2 * * *" },
  { label: "Every Sunday at midnight", value: "0 0 * * 0" },
  { label: "Custom", value: "custom" },
];

const DEFAULT_SCHEDULE = "0 2 * * *";

export default function ScheduleBackupFormModal({
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

  const handlePresetChange = (value) => {
    if (value !== "custom") {
      form.setFieldValue("schedule", value);
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await onCreate({
      sourcePath: values.sourcePath,
      schedule: values.schedule,
    });
  };

  return (
    <Modal
      open={open}
      title="Schedule Backup"
      okText="Create Schedule"
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
        initialValues={{ preset: DEFAULT_SCHEDULE, schedule: DEFAULT_SCHEDULE }}
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

        <Form.Item name="preset" label="Frequency">
          <Select options={PRESETS} onChange={handlePresetChange} />
        </Form.Item>

        <Form.Item
          name="schedule"
          label="Cron Expression"
          rules={[
            { required: true, message: "Please enter a cron expression" },
          ]}
          extra="Standard 5-field cron format (minute hour day month weekday)."
        >
          <Input placeholder="0 2 * * *" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
