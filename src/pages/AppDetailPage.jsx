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
      <Empty description="App not found">
        <Button
          type="primary"
          onClick={() =>
            navigate(`/clusters/${clusterId}/namespaces/${namespaceId}`)
          }
        >
          Back to Apps
        </Button>
      </Empty>
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
    <main>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() =>
          navigate(`/clusters/${clusterId}/namespaces/${namespaceId}`)
        }
        style={{
          paddingLeft: 0,
          marginBottom: 12,
        }}
      >
        Back to Apps
      </Button>

      <Space
        direction="vertical"
        size={16}
        style={{
          width: "100%",
        }}
      >
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
          }}
          align="start"
        >
          <div>
            <Title
              level={2}
              style={{
                marginBottom: 4,
              }}
            >
              {app.name}
            </Title>

            <Paragraph type="secondary">
              {cluster.name} / {namespace.name}
            </Paragraph>
          </div>

          <Space>
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
          </Space>
        </Space>

        {editing ? (
          <Card title="Edit App">
            <AppEditForm
              app={app}
              loading={saving}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          </Card>
        ) : (
          <Card>
            <Descriptions
              title="App Details"
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
                    app.ready ? (
                      <CheckCircleOutlined />
                    ) : (
                      <CloseCircleOutlined />
                    )
                  }
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
      </Space>

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
