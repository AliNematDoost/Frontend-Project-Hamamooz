import { useState } from "react";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Space, Typography, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import NamespaceList from "../components/NamespaceList";
import NamespaceFormModal from "../components/NamespaceFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { mockClusters, mockNamespaces } from "../mock/data";

const { Title, Paragraph } = Typography;

export default function NamespacesPage() {
  const { clusterId } = useParams();
  const navigate = useNavigate();

  const cluster = mockClusters.find(
    (item) => String(item.id) === String(clusterId),
  );

  const [namespaces, setNamespaces] = useState(mockNamespaces[clusterId] ?? []);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [namespaceToDelete, setNamespaceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleCreate = async (values) => {
    setCreating(true);

    try {
      const newNamespace = {
        id: Date.now(),
        name: values.name,
        cluster: cluster.id,
        created_at: new Date().toISOString(),
      };

      setNamespaces((current) => [...current, newNamespace]);

      message.success("Namespace created successfully");

      setCreateModalOpen(false);
    } catch {
      message.error("Failed to create namespace");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!namespaceToDelete) {
      return;
    }

    setDeleting(true);

    try {
      setNamespaces((current) =>
        current.filter((namespace) => namespace.id !== namespaceToDelete.id),
      );

      message.success("Namespace deleted successfully");

      setNamespaceToDelete(null);
    } catch {
      message.error("Failed to delete namespace");
    } finally {
      setDeleting(false);
    }
  };

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
