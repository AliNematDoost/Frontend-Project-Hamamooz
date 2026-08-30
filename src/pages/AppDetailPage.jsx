import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Descriptions,
  Empty,
  Space,
  Tag,
  Typography,
} from "antd";

import { useNavigate, useParams } from "react-router-dom";

import { mockClusters, mockNamespaces, mockApps } from "../mock/data";

const { Title, Paragraph } = Typography;

export default function AppDetailPage() {
  const { clusterId, namespaceId, appId } = useParams();

  const navigate = useNavigate();

  const cluster = mockClusters.find(
    (item) => String(item.id) === String(clusterId),
  );

  const namespace = (mockNamespaces[clusterId] ?? []).find(
    (item) => String(item.id) === String(namespaceId),
  );

  const app = (mockApps[namespaceId] ?? []).find(
    (item) => String(item.id) === String(appId),
  );

  if (!cluster || !namespace || !app) {
    return (
      <Empty description="App not found">
        <Button
          type="primary"
          onClick={() =>
            navigate(`/clusters/${clusterId}/namespaces/${namespaceId}`)
          }
        >
          Back to Apps
        </Button>
      </Empty>
    );
  }

  const readyPods = app.pods.filter((pod) => pod.ready).length;

  return (
    <main>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() =>
          navigate(`/clusters/${clusterId}/namespaces/${namespaceId}`)
        }
        style={{
          paddingLeft: 0,
          marginBottom: 12,
        }}
      >
        Back to Apps
      </Button>

      <Space
        direction="vertical"
        size={16}
        style={{
          width: "100%",
        }}
      >
        <div>
          <Title
            level={2}
            style={{
              marginBottom: 4,
            }}
          >
            {app.name}
          </Title>

          <Paragraph type="secondary">
            {cluster.name} / {namespace.name}
          </Paragraph>
        </div>

        <Card>
          <Descriptions
            title="App Details"
            bordered
            column={{
              xs: 1,
              sm: 2,
            }}
          >
            <Descriptions.Item label="Name">{app.name}</Descriptions.Item>

            <Descriptions.Item label="Status">
              <Tag
                color={app.ready ? "green" : "orange"}
                icon={
                  app.ready ? <CheckCircleOutlined /> : <CloseCircleOutlined />
                }
              >
                {app.ready ? "Running" : "Not Ready"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Image">{app.image}</Descriptions.Item>

            <Descriptions.Item label="Replicas">
              {app.replicas}
            </Descriptions.Item>

            <Descriptions.Item label="Ready Pods">
              {readyPods}/{app.pods.length}
            </Descriptions.Item>

            <Descriptions.Item label="CPU">{app.cpu}</Descriptions.Item>

            <Descriptions.Item label="Memory">{app.memory}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </main>
  );
}
