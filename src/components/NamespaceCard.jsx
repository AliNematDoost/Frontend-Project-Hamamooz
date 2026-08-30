import { ApartmentOutlined } from "@ant-design/icons";
import { Card, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function NamespaceCard({ namespace, clusterId }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/clusters/${clusterId}/namespaces/${namespace.id}`);
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
          <div
            style={{
              marginTop: 8,
            }}
          >
            <Tag color="green">Active</Tag>

            <Text
              type="secondary"
              style={{
                display: "block",
                marginTop: 8,
              }}
            >
              Namespace ID: {namespace.id}
            </Text>
          </div>
        }
      />
    </Card>
  );
}
