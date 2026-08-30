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
      <Empty description="Cluster not found">
        <Button type="primary" onClick={() => navigate("/clusters")}>
          Back to Clusters
        </Button>
      </Empty>
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
    <main>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/clusters")}
        style={{
          paddingLeft: 0,
          marginBottom: 12,
        }}
      >
        Back to Clusters
      </Button>

      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 16,
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
            {cluster.name}
          </Title>

          <Paragraph type="secondary">
            Select a namespace to manage its apps.
          </Paragraph>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create Namespace
        </Button>
      </Space>

      {namespaces.length === 0 ? (
        <Empty description={"No namespaces found in this cluster"}>
          <Button type="primary" onClick={() => setCreateModalOpen(true)}>
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
