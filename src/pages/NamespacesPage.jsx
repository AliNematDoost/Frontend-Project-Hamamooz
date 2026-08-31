import { useCallback, useEffect, useState } from "react";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Empty, Skeleton, Typography, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import NamespaceList from "../components/NamespaceList";
import NamespaceFormModal from "../components/NamespaceFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { listClusters } from "../api/clusters";
import {
  createNamespace,
  deleteNamespace,
  listNamespaces,
} from "../api/namespaces";

const { Title, Paragraph } = Typography;

export default function NamespacesPage() {
  const { clusterId } = useParams();
  const navigate = useNavigate();

  const [cluster, setCluster] = useState(null);
  const [namespaces, setNamespaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [namespaceToDelete, setNamespaceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [clustersData, namespacesData] = await Promise.all([
        listClusters(),
        listNamespaces(clusterId),
      ]);

      setCluster(
        clustersData.find((item) => String(item.id) === String(clusterId)) ??
          null,
      );
      setNamespaces(namespacesData);
    } catch {
      setError("Failed to load namespaces");
      message.error("Failed to load namespaces");
    } finally {
      setLoading(false);
    }
  }, [clusterId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (values) => {
    setCreating(true);

    try {
      await createNamespace({ clusterId, name: values.name });
      message.success("Namespace created successfully");
      setCreateModalOpen(false);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.error ?? "Failed to create namespace");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!namespaceToDelete) return;
    setDeleting(true);

    try {
      await deleteNamespace(namespaceToDelete.id);
      message.success("Namespace deleted successfully");
      setNamespaceToDelete(null);
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.error ?? "Failed to delete namespace");
    } finally {
      setDeleting(false);
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

  if (!cluster) {
    return (
      <main className="app-page">
        <Empty className="empty-state" description="Cluster not found">
          <Button type="primary" onClick={() => navigate("/clusters")}>
            Back to Clusters
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
        onClick={() => navigate("/clusters")}
      >
        Back to Clusters
      </Button>

      <header className="page-header">
        <div className="page-header-content">
          <p className="page-eyebrow">Cluster</p>
          <Title className="page-title">{cluster.name}</Title>
          <Paragraph className="page-description">
            Explore and manage the namespaces running inside this cluster.
          </Paragraph>
        </div>

        <div className="page-actions">
          <Button
            type="primary"
            className="primary-action"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Namespace
          </Button>
        </div>
      </header>

      {namespaces.length === 0 ? (
        <Empty
          className="empty-state"
          description={"No namespaces found in this cluster"}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Namespace
          </Button>
        </Empty>
      ) : (
        <NamespaceList
          namespaces={namespaces}
          clusterId={cluster.id}
          onDelete={setNamespaceToDelete}
        />
      )}

      <NamespaceFormModal
        open={createModalOpen}
        loading={creating}
        onCreate={handleCreate}
        onCancel={() => setCreateModalOpen(false)}
      />

      <ConfirmDeleteModal
        open={namespaceToDelete !== null}
        loading={deleting}
        itemName={namespaceToDelete?.name ?? ""}
        onConfirm={handleDelete}
        onCancel={() => setNamespaceToDelete(null)}
      />
    </main>
  );
}
