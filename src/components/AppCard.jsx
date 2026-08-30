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
    <Card className="resource-card" hoverable onClick={onClick}>
      <Card.Meta
        avatar={
          <div className="resource-card-icon">
            <CodeOutlined />
          </div>
        }
        title={app.name}
        description={
          <>
            <Text className="resource-address" ellipsis>
              {app.image}
            </Text>

            <div className="resource-meta">
              <Tag
                color={app.ready ? "green" : "orange"}
                icon={
                  app.ready ? <CheckCircleOutlined /> : <CloseCircleOutlined />
                }
                className="resource-status"
              >
                {app.ready ? "Running" : "Not Ready"}
              </Tag>

              <Tag className="resource-status">
                {app.replicas} {app.replicas === 1 ? "Replica" : "Replicas"}
              </Tag>

              <Tag className="resource-status">
                Pods {readyPods}/{app.pods.length}
              </Tag>
            </div>

            <div className="resource-actions">
              <Space size={14}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                  }}
                >
                  CPU: {app.cpu}
                </Text>

                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                  }}
                >
                  Memory: {app.memory}
                </Text>
              </Space>

              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                }}
              >
                View details →
              </Text>
            </div>
          </>
        }
      />
    </Card>
  );
}
