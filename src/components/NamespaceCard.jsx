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
    <Card
      hoverable
      onClick={handleClick}
      style={{
        borderRadius: 12,
        height: "100%",
      }}
    >
      <Card.Meta
        avatar={
          <ApartmentOutlined
            style={{
              fontSize: 28,
              color: "#1677ff",
            }}
          />
        }
        title={namespace.name}
        description={
          <Space
            direction="vertical"
            size={8}
            style={{
              width: "100%",
              marginTop: 8,
            }}
          >
            <Space>
              <Tag color="green">Active</Tag>

              <Text type="secondary">ID: {namespace.id}</Text>
            </Space>

            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </Space>
        }
      />
    </Card>
  );
}
