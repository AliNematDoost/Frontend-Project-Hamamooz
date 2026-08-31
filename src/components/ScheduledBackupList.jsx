import { StopOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Tag, Typography } from "antd";

const { Text } = Typography;

export default function ScheduledBackupList({
  schedules,
  loading,
  deactivatingId,
  onDeactivate,
}) {
  const columns = [
    {
      title: "Source Path",
      dataIndex: "source_path",
      key: "source_path",
      render: (value) => (
        <Text className="backup-truncate" title={value}>
          {value}
        </Text>
      ),
    },
    {
      title: "Schedule",
      dataIndex: "schedule",
      key: "schedule",
      render: (value) => <Text code>{value}</Text>,
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (value) => (value ? new Date(value).toLocaleString() : "—"),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (value) => (
        <Tag color={value ? "green" : "default"} className="resource-status">
          {value ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_, record) =>
        record.active ? (
          <Popconfirm
            title="Deactivate this schedule?"
            okText="Deactivate"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDeactivate(record.schedule_backup_id)}
          >
            <Button
              size="small"
              danger
              type="text"
              icon={<StopOutlined />}
              loading={deactivatingId === record.schedule_backup_id}
            >
              Deactivate
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <Table
      className="backup-table"
      rowKey="schedule_backup_id"
      columns={columns}
      dataSource={schedules}
      loading={loading}
      pagination={false}
      locale={{ emptyText: "No scheduled backups" }}
      scroll={{ x: 760 }}
    />
  );
}