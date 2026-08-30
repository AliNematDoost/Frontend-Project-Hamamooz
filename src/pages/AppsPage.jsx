import { useState } from "react";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Space, Typography, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import AppList from "../components/AppList";
import AppFormModal from "../components/AppFormModal";
import { mockClusters, mockNamespaces, mockApps } from "../mock/data";

const { Title, Paragraph } = Typography;

export default function AppsPage() {
  const { clusterId, namespaceId } = useParams();
  const navigate = useNavigate();

  const cluster = mockClusters.find(
    (item) => String(item.id) === String(clusterId),
  );

  const namespace = (mockNamespaces[clusterId] ?? []).find(
    (item) => String(item.id) === String(namespaceId),
  );

  const [apps, setApps] = useState(mockApps[namespaceId] ?? []);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  if (!cluster || !namespace) {
    return (
      <main className="app-page">
        <Empty className="empty-state" description="Namespace not found">
          <Button
            type="primary"
            onClick={() => navigate(`/clusters/${clusterId}`)}
          >
            Back to Namespaces
          </Button>
        </Empty>
      </main>
    );
  }

  const handleCreate = async (values) => {
    setCreating(true);

    try {
      const newApp = {
        id: Date.now(),
        name: values.name,
        namespace: namespace.name,
        namespace_id: namespace.id,
        image: values.image,
        replicas: values.replicas,
        cpu: values.cpu,
        memory: values.memory,
        ready: false,
        pods: [],
      };

      setApps((current) => [...current, newApp]);

      message.success("App created successfully");

      setCreateModalOpen(false);
    } catch {
      message.error("Failed to create app");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="app-page">
      <Button
        type="text"
        className="back-button"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(`/clusters/${clusterId}`)}
      >
        Back to Namespaces
      </Button>

      <header className="page-header">
        <div className="page-header-content">
          <p className="page-eyebrow">Namespace</p>

          <Title className="page-title">{namespace.name}</Title>

          <Paragraph className="page-description">
            Applications deployed in the {namespace.name} namespace.
          </Paragraph>
        </div>

        <div className="page-actions">
          <Button
            type="primary"
            className="primary-action"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create App
          </Button>
        </div>
      </header>

      {apps.length === 0 ? (
        <Empty
          className="empty-state"
          description={"No apps found in this namespace"}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create App
          </Button>
        </Empty>
      ) : (
        <AppList
          apps={apps}
          onAppClick={(app) =>
            navigate(
              `/clusters/${clusterId}/namespaces/${namespaceId}/apps/${app.id}`,
            )
          }
        />
      )}

      <AppFormModal
        open={createModalOpen}
        loading={creating}
        onCreate={handleCreate}
        onCancel={() => setCreateModalOpen(false)}
      />
    </main>
  );
}
