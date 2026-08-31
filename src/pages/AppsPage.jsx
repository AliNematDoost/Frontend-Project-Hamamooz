import { useCallback, useEffect, useState } from "react";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Empty, Skeleton, Typography, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import AppList from "../components/AppList";
import AppFormModal from "../components/AppFormModal";
import { listNamespaces } from "../api/namespaces";
import { createApp, listApps } from "../api/apps";

const { Title, Paragraph } = Typography;

export default function AppsPage() {
  const { clusterId, namespaceId } = useParams();
  const navigate = useNavigate();

  const [namespace, setNamespace] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [namespacesData, appsData] = await Promise.all([
        listNamespaces(clusterId),
        listApps(namespaceId),
      ]);

      setNamespace(
        namespacesData.find(
          (item) => String(item.id) === String(namespaceId),
        ) ?? null,
      );
      setApps(appsData);
    } catch {
      setError("Failed to load apps");
      message.error("Failed to load apps");
    } finally {
      setLoading(false);
    }
  }, [clusterId, namespaceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (values) => {
    setCreating(true);

    try {
      await createApp({
        namespaceId,
        name: values.name,
        image: values.image,
        replicas: values.replicas,
        cpu: values.cpu,
        memory: values.memory,
      });

      message.success("App created successfully");
      setCreateModalOpen(false);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.error ?? "Failed to create app");
    } finally {
      setCreating(false);
    }
  };

  if (loading)
    return (
      <main className="app-page">
        <Skeleton active paragraph={{ rows: 4 }} />
      </main>
    );
  if (error)
    return (
      <main className="app-page">
        <Alert type="error" showIcon message={error} />
      </main>
    );

  if (!namespace) {
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
