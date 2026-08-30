import { Modal } from "antd";

export default function ConfirmDeleteModal({
  open,
  loading,
  itemName,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      title="Confirm Delete"
      okText="Delete"
      okButtonProps={{
        danger: true,
      }}
      confirmLoading={loading}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <p>
        Are you sure you want to delete <strong>{itemName}</strong>?
      </p>

      <p>This action cannot be undone.</p>
    </Modal>
  );
}