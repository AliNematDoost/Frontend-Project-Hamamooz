import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CodeOutlined,
} from "@ant-design/icons";

import { Card, Space, Tag, Typography } from "antd";

const { Text } = Typography;

export default function AppCard({ app, onClick }) {
  const readyPods = app.pods.filter((pod) => pod.ready).length;

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        borderRadius: 12,
        height: "100%",
      }}
    >
      <Card.Meta
        avatar={
          <CodeOutlined
            style={{
              fontSize: 28,
              color: "#1677ff",
            }}
          />
        }
        title={app.name}
        description={
          <Space
            direction="vertical"
            size={8}
            style={{
              width: "100%",
              marginTop: 8,
            }}
          >
            <Text type="secondary" ellipsis>
              {app.image}
            </Text>

            <Space wrap>
              <Tag
                color={app.ready ? "green" : "orange"}
                icon={
                  app.ready ? <CheckCircleOutlined /> : <CloseCircleOutlined />
                }
              >
                {app.ready ? "Running" : "Not Ready"}
              </Tag>

              <Tag>Replicas: {app.replicas}</Tag>

              <Tag>
                Pods: {readyPods}/{app.pods.length}
              </Tag>
            </Space>

            <Text>CPU: {app.cpu}</Text>

            <Text>Memory: {app.memory}</Text>
          </Space>
        }
      />
    </Card>
  );
}
