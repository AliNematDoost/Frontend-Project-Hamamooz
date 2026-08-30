import { Typography } from "antd";

import ClusterList from "../components/ClusterList";
import { mockClusters } from "../mock/data";

const { Title, Paragraph } = Typography;

export default function ClustersPage() {
  return (
    <main>
      <Title level={2}>Clusters</Title>

      <Paragraph type="secondary">
        Select a cluster to manage its namespaces and apps.
      </Paragraph>

      <ClusterList clusters={mockClusters} />
    </main>
  );
}
