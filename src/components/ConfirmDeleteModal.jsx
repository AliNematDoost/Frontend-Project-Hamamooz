import { Modal } from "antd";

export default function ConfirmDeleteModal({
  open,
  loading,
  appName,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      title="Delete App"
      okText="Delete"
      okButtonProps={{
        danger: true,
      }}
      confirmLoading={loading}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <p>
        Are you sure you want to delete <strong>{appName}</strong>?
      </p>

      <p>This action cannot be undone.</p>
    </Modal>
  );
}
