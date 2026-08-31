import { useEffect, useState } from "react";
import { ClusterOutlined } from "@ant-design/icons";
import { Alert, Empty, Skeleton, Typography, message } from "antd";
import ClusterList from "../components/ClusterList";
import { listClusters } from "../api/clusters";

const { Title, Paragraph } = Typography;

export default function ClustersPage() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchClusters = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await listClusters();
        if (!cancelled) setClusters(data);
      } catch {
        if (!cancelled) {
          setError("Failed to load clusters");
          message.error("Failed to load clusters");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchClusters();
    return () => {
      cancelled = true;
    };
  }, []);

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
          <ClusterOutlined
            style={{
              color: "#1677ff",
              fontSize: 28,
            }}
          />
        </div>
      </header>

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : error ? (
        <Alert type="error" showIcon message={error} />
      ) : clusters.length === 0 ? (
        <Empty className="empty-state" description="No clusters found" />
      ) : (
        <section className="resource-grid">
          <ClusterList clusters={clusters} />
        </section>
      )}
    </main>
  );
}
