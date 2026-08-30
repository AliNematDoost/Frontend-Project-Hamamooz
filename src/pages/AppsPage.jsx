import { ArrowLeftOutlined } from "@ant-design/icons";

import { Button, Empty, Typography } from "antd";

import { useNavigate, useParams } from "react-router-dom";

import AppList from "../components/AppList";

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

  const apps = mockApps[namespaceId] ?? [];

  if (!cluster || !namespace) {
    return (
      <Empty description="Namespace not found">
        <Button
          type="primary"
          onClick={() => navigate(`/clusters/${clusterId}`)}
        >
          Back to Namespaces
        </Button>
      </Empty>
    );
  }

  return (
    <main>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(`/clusters/${clusterId}`)}
        style={{
          paddingLeft: 0,
          marginBottom: 12,
        }}
      >
        Back to Namespaces
      </Button>

      <Title level={2}>{namespace.name}</Title>

      <Paragraph type="secondary">Apps in {namespace.name} namespace</Paragraph>

      {apps.length === 0 ? (
        <Empty description="No apps found in this namespace" />
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
    </main>
  );
}
