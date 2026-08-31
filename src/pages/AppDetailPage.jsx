import { useState } from "react";

import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  CloudUploadOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Descriptions,
  Empty,
  Space,
  Tag,
  Typography,
  message,
  Tabs,
} from "antd";

import { useNavigate, useParams } from "react-router-dom";
import AppEditForm from "../components/AppEditForm";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { mockClusters, mockNamespaces, mockApps, mockBackups, mockSchedules } from "../mock/data";
import BackupFormModal from "../components/BackupFormModal";
import ScheduleBackupFormModal from "../components/ScheduleBackupFormModal";
import BackupHistoryList from "../components/BackupHistoryList";
import ScheduledBackupList from "../components/ScheduledBackupList";

const { Title, Paragraph } = Typography;

export default function AppDetailPage() {
  const { clusterId, namespaceId, appId } = useParams();

  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const [backups, setBackups] = useState(mockBackups[appId] ?? []);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [backupSubmitting, setBackupSubmitting] = useState(false);

  const [schedules, setSchedules] = useState(mockSchedules[appId] ?? []);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState(null);

  const cluster = mockClusters.find(
    (item) => String(item.id) === String(clusterId),
  );

  const namespace = (mockNamespaces[clusterId] ?? []).find(
    (item) => String(item.id) === String(namespaceId),
  );

  const app = (mockApps[namespaceId] ?? []).find(
    (item) => String(item.id) === String(appId),
  );

  if (!cluster || !namespace || !app) {
    return (
      <main className="app-page">
        <Empty className="empty-state" description="App not found">
          <Button
            type="primary"
            onClick={() =>
              navigate(`/clusters/${clusterId}/namespaces/${namespaceId}`)
            }
          >
            Back to Apps
          </Button>
        </Empty>
      </main>
    );
  }

  const readyPods = app.pods.filter((pod) => pod.ready).length;

  const handleSave = async (values) => {
    setSaving(true);

    try {
      app.replicas = values.replicas;

      app.cpu = `${values.cpu}m`;

      app.memory = values.memory;

      message.success("App updated successfully");

      setEditing(false);
    } catch {
      message.error("Failed to update app");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const apps = mockApps[namespaceId] ?? [];

      const index = apps.findIndex((item) => String(item.id) === String(appId));

      if (index !== -1) {
        apps.splice(index, 1);
      }

      message.success("App deleted successfully");

      navigate(`/clusters/${clusterId}/namespaces/${namespaceId}`);
    } catch {
      message.error("Failed to delete app");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleRunBackup = async (values) => {
    setBackupSubmitting(true);

    try {
      const newBackup = {
        backup_id: `bkp_${Date.now()}`,
        status: "pending",
        pod_name: "",
        output_path: "",
        error: "",
        is_scheduled: false,
      };

      setBackups((current) => [newBackup, ...current]);

      message.success("Backup started");

      setBackupModalOpen(false);
    } catch {
      message.error("Failed to start backup");
    } finally {
      setBackupSubmitting(false);
    }
  };

  const handleCreateSchedule = async (values) => {
    setScheduleSubmitting(true);

    try {
      const newSchedule = {
        schedule_backup_id: `sch_${Date.now()}`,
        schedule: values.schedule,
        source_path: values.sourcePath,
        created_at: new Date().toISOString(),
        active: true,
      };

      setSchedules((current) => [newSchedule, ...current]);

      message.success("Backup schedule created");

      setScheduleModalOpen(false);
    } catch {
      message.error("Failed to create backup schedule");
    } finally {
      setScheduleSubmitting(false);
    }
  };

  const handleDeactivateSchedule = async (scheduleId) => {
    setDeactivatingId(scheduleId);

    try {
      setSchedules((current) =>
        current.map((item) =>
          item.schedule_backup_id === scheduleId
            ? { ...item, active: false }
            : item,
        ),
      );

      message.success("Schedule deactivated");
    } catch {
      message.error("Failed to deactivate schedule");
    } finally {
      setDeactivatingId(null);
    }
  };

  return (
    <main className="app-page">
      <Button
        type="text"
        className="back-button"
        icon={<ArrowLeftOutlined />}
        onClick={() =>
          navigate(`/clusters/${clusterId}/namespaces/${namespaceId}`)
        }
      >
        Back to Apps
      </Button>

      <header className="page-header">
        <div className="page-header-content">
          <p className="page-eyebrow">Application</p>

          <Title className="page-title">{app.name}</Title>

          <Paragraph className="page-description">
            {cluster.name} / {namespace.name}
          </Paragraph>
        </div>

        <div className="page-actions">
          <Button icon={<CloudUploadOutlined />} onClick={() => setBackupModalOpen(true)}>
            Backup Now
          </Button>
          <Button icon={<ScheduleOutlined />} onClick={() => setScheduleModalOpen(true)}>
            Schedule Backup
          </Button>

          {!editing && (
            <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}

          <Button danger icon={<DeleteOutlined />} onClick={() => setDeleteModalOpen(true)}>
            Delete
          </Button>
        </div>
        
      </header>

      {editing ? (
        <Card className="edit-card" title="Edit Application">
          <AppEditForm
            app={app}
            loading={saving}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        </Card>
      ) : (
        <Card className="detail-card">
          <Descriptions
            title="Application Details"
            bordered
            column={{
              xs: 1,
              sm: 2,
            }}
          >
            <Descriptions.Item label="Name">{app.name}</Descriptions.Item>

            <Descriptions.Item label="Status">
              <Tag
                color={app.ready ? "green" : "orange"}
                icon={
                  app.ready ? <CheckCircleOutlined /> : <CloseCircleOutlined />
                }
                className="resource-status"
              >
                {app.ready ? "Running" : "Not Ready"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Image">{app.image}</Descriptions.Item>

            <Descriptions.Item label="Replicas">
              {app.replicas}
            </Descriptions.Item>

            <Descriptions.Item label="Ready Pods">
              {readyPods}/{app.pods.length}
            </Descriptions.Item>

            <Descriptions.Item label="CPU">{app.cpu}</Descriptions.Item>

            <Descriptions.Item label="Memory">{app.memory}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <Card className="backup-card">
        <div className="backup-card-header">
          <Title level={5} className="backup-card-title">Backups</Title>
        </div>

        <Tabs
          defaultActiveKey="history"
          items={[
            {
              key: "history",
              label: "History",
              children: <BackupHistoryList backups={backups} loading={false} />,
            },
            {
              key: "scheduled",
              label: "Scheduled",
              children: (
                <ScheduledBackupList
                  schedules={schedules}
                  loading={false}
                  deactivatingId={deactivatingId}
                  onDeactivate={handleDeactivateSchedule}
                />
              ),
            },
          ]}
        />
      </Card>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        loading={deleting}
        itemName={app.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      <BackupFormModal
        open={backupModalOpen}
        loading={backupSubmitting}
        onCreate={handleRunBackup}
        onCancel={() => setBackupModalOpen(false)}
      />

      <ScheduleBackupFormModal
        open={scheduleModalOpen}
        loading={scheduleSubmitting}
        onCreate={handleCreateSchedule}
        onCancel={() => setScheduleModalOpen(false)}
      />
    </main>
  );
}
