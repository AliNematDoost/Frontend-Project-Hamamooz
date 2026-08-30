import { ApartmentOutlined, DeleteOutlined } from "@ant-design/icons";

import { Button, Card, Space, Tag, Typography } from "antd";

import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function NamespaceCard({ namespace, clusterId, onDelete }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/clusters/${clusterId}/namespaces/${namespace.id}`);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete(namespace);
  };

  return (
    <Card className="resource-card" hoverable onClick={handleClick}>
      <Card.Meta
        avatar={
          <div className="resource-card-icon">
            <ApartmentOutlined />
          </div>
        }
        title={namespace.name}
        description={
          <>
            <div className="resource-meta">
              <Tag color="green" className="resource-status">
                Active
              </Tag>

              <Text className="resource-id">Namespace ID: {namespace.id}</Text>
            </div>

            <div className="resource-actions">
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                }}
              >
                View Apps
              </Text>

              <Button
                type="text"
                danger
                size="small"
                className="delete-button"
                icon={<DeleteOutlined />}
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </div>
          </>
        }
      />
    </Card>
  );
}
