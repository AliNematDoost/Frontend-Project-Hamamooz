import { useState } from "react";

import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
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
} from "antd";

import { useNavigate, useParams } from "react-router-dom";

import AppEditForm from "../components/AppEditForm";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

import { mockClusters, mockNamespaces, mockApps } from "../mock/data";

const { Title, Paragraph } = Typography;

export default function AppDetailPage() {
  const { clusterId, namespaceId, appId } = useParams();

  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

      <ConfirmDeleteModal
        open={deleteModalOpen}
        loading={deleting}
        itemName={app.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </main>
  );
}
