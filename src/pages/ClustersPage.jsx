import { useCallback, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Empty, Skeleton, Typography, message } from "antd";
import ClusterList from "../components/ClusterList";
import ClusterFormModal from "../components/ClusterFormModal";
import { createCluster, listClusters } from "../api/clusters";

const { Title, Paragraph } = Typography;

export default function ClustersPage() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchClusters = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listClusters();
      setClusters(data);
    } catch {
      setError("Failed to load clusters");
      message.error("Failed to load clusters");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  const handleCreate = async (values) => {
    setCreating(true);

    try {
      await createCluster({
        name: values.name,
        address: values.address,
        token: values.token,
      });
      message.success("Cluster created successfully");
      setCreateModalOpen(false);
      fetchClusters();
    } catch (err) {
      const data = err?.response?.data;
      const firstError =
        data?.name?.[0] ?? data?.address?.[0] ?? data?.token?.[0];
      message.error(firstError ?? "Failed to create cluster");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="app-page">
      <header className="page-header">
        <div className="page-header-content">
          <p className="page-eyebrow">Kubernetes</p>
          <Title className="page-title">Clusters</Title>
          <Paragraph className="page-description">
            Manage your Kubernetes clusters and explore their namespaces and
            applications.
          </Paragraph>
        </div>

        <div className="page-actions">
          <Button
            type="primary"
            className="primary-action"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Cluster
          </Button>
        </div>
      </header>

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : error ? (
        <Alert type="error" showIcon message={error} />
      ) : clusters.length === 0 ? (
        <Empty className="empty-state" description="No clusters found">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Cluster
          </Button>
        </Empty>
      ) : (
        <section className="resource-grid">
          <ClusterList clusters={clusters} />
        </section>
      )}

      <ClusterFormModal
        open={createModalOpen}
        loading={creating}
        onCreate={handleCreate}
        onCancel={() => setCreateModalOpen(false)}
      />
    </main>
  );
}
