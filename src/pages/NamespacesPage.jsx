import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Empty, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import NamespaceList from "../components/NamespaceList";
import { mockClusters, mockNamespaces } from "../mock/data";

const { Title, Paragraph } = Typography;

export default function NamespacesPage() {
  const { clusterId } = useParams();
  const navigate = useNavigate();

  const cluster = mockClusters.find(
    (item) => String(item.id) === String(clusterId),
  );

  const namespaces = mockNamespaces[clusterId] ?? [];

  if (!cluster) {
    return (
      <Empty description="Cluster not found">
        <Button type="primary" onClick={() => navigate("/clusters")}>
          Back to Clusters
        </Button>
      </Empty>
    );
  }

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

      <Title level={2}>{cluster.name}</Title>

      <Paragraph type="secondary">
        Select a namespace to manage its apps.
      </Paragraph>

      {namespaces.length === 0 ? (
        <Empty description="No namespaces found in this cluster" />
      ) : (
        <NamespaceList namespaces={namespaces} clusterId={cluster.id} />
      )}
    </main>
  );
}
