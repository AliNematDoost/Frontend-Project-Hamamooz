import { ClusterOutlined } from "@ant-design/icons";

import { Typography } from "antd";

import ClusterList from "../components/ClusterList";
import { mockClusters } from "../mock/data";

const { Title, Paragraph } = Typography;

export default function ClustersPage() {
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

      <section className="resource-grid">
        <ClusterList clusters={mockClusters} />
      </section>
    </main>
  );
}
