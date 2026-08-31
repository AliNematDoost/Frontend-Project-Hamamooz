import { useCallback, useEffect, useState } from "react";

import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";

import {
  Alert,
  Button,
  Card,
  Descriptions,
  Empty,
  Skeleton,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";

import { useNavigate, useParams } from "react-router-dom";

import AppEditForm from "../components/AppEditForm";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import BackupFormModal from "../components/BackupFormModal";
import ScheduleBackupFormModal from "../components/ScheduleBackupFormModal";
import BackupHistoryList from "../components/BackupHistoryList";
import ScheduledBackupList from "../components/ScheduledBackupList";

import { listClusters } from "../api/clusters";
import { listNamespaces } from "../api/namespaces";
import { deleteApp, listApps, updateApp } from "../api/apps";
import {
  createBackup,
  deactivateSchedule,
  listAppBackups,
  listAppSchedules,
} from "../api/backup";

const { Title, Paragraph } = Typography;

const BACKUP_POLL_INTERVAL_MS = 6000;

export default function AppDetailPage() {
  const { clusterId, namespaceId, appId } = useParams();
  const navigate = useNavigate();

  const [cluster, setCluster] = useState(null);
  const [namespace, setNamespace] = useState(null);
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [backups, setBackups] = useState([]);
  const [backupsLoading, setBackupsLoading] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [backupSubmitting, setBackupSubmitting] = useState(false);

  const [schedules, setSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState(null);

  const fetchApp = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [clustersData, namespacesData, appsData] = await Promise.all([
        listClusters(),
        listNamespaces(clusterId),
        listApps(namespaceId),
      ]);

      setCluster(
        clustersData.find((item) => String(item.id) === String(clusterId)) ??
          null,
      );
      setNamespace(
        namespacesData.find(
          (item) => String(item.id) === String(namespaceId),
        ) ?? null,
      );
      setApp(
        appsData.find((item) => String(item.id) === String(appId)) ?? null,
      );
    } catch {
      setError("Failed to load app");
      message.error("Failed to load app");
    } finally {
      setLoading(false);
    }
  }, [clusterId, namespaceId, appId]);

  useEffect(() => {
    fetchApp();
  }, [fetchApp]);

  const fetchBackups = useCallback(
    async ({ silent } = {}) => {
      if (!silent) setBackupsLoading(true);

      try {
        const data = await listAppBackups(appId);
        setBackups(data);
      } catch {
        if (!silent) message.error("Failed to load backups");
      } finally {
        if (!silent) setBackupsLoading(false);
      }
    },
    [appId],
  );

  const fetchSchedules = useCallback(async () => {
    setSchedulesLoading(true);

    try {
      const data = await listAppSchedules(appId);
      setSchedules(data);
    } catch {
      message.error("Failed to load scheduled backups");
    } finally {
      setSchedulesLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    fetchBackups();
    fetchSchedules();
  }, [fetchBackups, fetchSchedules]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBackups({ silent: true });
    }, BACKUP_POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchBackups]);

  const handleSave = async (values) => {
    setSaving(true);

    try {
      const updated = await updateApp(appId, {
        replicas: values.replicas,
        cpu: `${values.cpu}m`,
        memory: values.memory,
      });

      setApp((current) => ({ ...current, ...updated }));
      message.success("App updated successfully");
      setEditing(false);
    } catch (err) {
      message.error(err?.response?.data?.error ?? "Failed to update app");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await deleteApp(appId);
      message.success("App deleted successfully");
      navigate(`/clusters/${clusterId}/namespaces/${namespaceId}`);
    } catch (err) {
      message.error(err?.response?.data?.error ?? "Failed to delete app");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleRunBackup = async (values) => {
    setBackupSubmitting(true);

    try {
      await createBackup({ appId, sourcePath: values.sourcePath });
      message.success("Backup started");
      setBackupModalOpen(false);
      fetchBackups();
    } catch (err) {
      message.error(err?.response?.data?.error ?? "Failed to start backup");
    } finally {
      setBackupSubmitting(false);
    }
  };

  const handleCreateSchedule = async (values) => {
    setScheduleSubmitting(true);

    try {
      await createBackup({
        appId,
        sourcePath: values.sourcePath,
        schedule: values.schedule,
      });
      message.success("Backup schedule created");
      setScheduleModalOpen(false);
      fetchSchedules();
    } catch (err) {
      message.error(
        err?.response?.data?.error ?? "Failed to create backup schedule",
      );
    } finally {
      setScheduleSubmitting(false);
    }
  };

  const handleDeactivateSchedule = async (scheduleId) => {
    setDeactivatingId(scheduleId);

    try {
      await deactivateSchedule(scheduleId);
      message.success("Schedule deactivated");
      fetchSchedules();
    } catch (err) {
      message.error(
        err?.response?.data?.error ?? "Failed to deactivate schedule",
      );
    } finally {
      setDeactivatingId(null);
    }
  };

  if (loading)
    return (
      <main className="app-page">
        <Skeleton active paragraph={{ rows: 6 }} />
      </main>
    );
  if (error)
    return (
      <main className="app-page">
        <Alert type="error" showIcon message={error} />
      </main>
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

  const readyPods = (app.pods ?? []).filter((pod) => pod.ready).length;

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
          <Button
            icon={<CloudUploadOutlined />}
            onClick={() => setBackupModalOpen(true)}
          >
            Backup Now
          </Button>
          <Button
            icon={<ScheduleOutlined />}
            onClick={() => setScheduleModalOpen(true)}
          >
            Schedule Backup
          </Button>

          {!editing && (
            <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteModalOpen(true)}
          >
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
            column={{ xs: 1, sm: 2 }}
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
              {readyPods}/{(app.pods ?? []).length}
            </Descriptions.Item>
            <Descriptions.Item label="CPU">{app.cpu}</Descriptions.Item>
            <Descriptions.Item label="Memory">{app.memory}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <Card className="backup-card">
        <div className="backup-card-header">
          <Title level={5} className="backup-card-title">
            Backups
          </Title>
        </div>

        <Tabs
          defaultActiveKey="history"
          items={[
            {
              key: "history",
              label: "History",
              children: (
                <BackupHistoryList backups={backups} loading={backupsLoading} />
              ),
            },
            {
              key: "scheduled",
              label: "Scheduled",
              children: (
                <ScheduledBackupList
                  schedules={schedules}
                  loading={schedulesLoading}
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
