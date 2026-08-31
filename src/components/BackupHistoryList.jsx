import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Table, Tag, Tooltip, Typography } from "antd";

const { Text } = Typography;

const STATUS_META = {
  pending: { color: "default", icon: <ClockCircleOutlined /> },
  running: { color: "processing", icon: <SyncOutlined spin /> },
  completed: { color: "green", icon: <CheckCircleOutlined /> },
  failed: { color: "red", icon: <CloseCircleOutlined /> },
};

export default function BackupHistoryList({ backups, loading }) {
  const columns = [
    {
      title: "Backup",
      dataIndex: "backup_id",
      key: "backup_id",
      render: (value) => (
        <Text code className="backup-id">
          {value}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        const meta = STATUS_META[value] ?? STATUS_META.pending;
        return (
          <Tag color={meta.color} icon={meta.icon} className="resource-status">
            {value}
          </Tag>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "is_scheduled",
      key: "is_scheduled",
      render: (value) => (
        <Tag className="resource-status">{value ? "Scheduled" : "Instant"}</Tag>
      ),
    },
    {
      title: "Pod",
      dataIndex: "pod_name",
      key: "pod_name",
      render: (value) => value || <Text type="secondary">—</Text>,
    },
    {
      title: "Output Path",
      dataIndex: "output_path",
      key: "output_path",
      render: (value) =>
        value ? (
          <Tooltip title={value}>
            <Text className="backup-truncate">{value}</Text>
          </Tooltip>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Error",
      dataIndex: "error",
      key: "error",
      render: (value) =>
        value ? (
          <Tooltip title={value}>
            <Text type="danger" className="backup-truncate">
              {value}
            </Text>
          </Tooltip>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
  ];

  return (
    <Table
      className="backup-table"
      rowKey="backup_id"
      columns={columns}
      dataSource={backups}
      loading={loading}
      pagination={false}
      locale={{ emptyText: "No backups yet" }}
      scroll={{ x: 760 }}
    />
  );
}
