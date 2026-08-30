import { ApartmentOutlined, CloudServerOutlined } from "@ant-design/icons";

import { Card, Space, Tag, Typography } from "antd";

import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function ClusterCard({ cluster }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/clusters/${cluster.id}`);
  };

  return (
    <Card className="resource-card" hoverable onClick={handleClick}>
      <Card.Meta
        avatar={
          <div className="resource-card-icon">
            <CloudServerOutlined />
          </div>
        }
        title={cluster.name}
        description={
          <>
            <Text className="resource-address" ellipsis>
              {cluster.address}
            </Text>

            <div className="resource-meta">
              <Tag color="green" className="resource-status">
                Connected
              </Tag>

              <Tag icon={<ApartmentOutlined />} className="resource-status">
                Kubernetes Cluster
              </Tag>
            </div>
          </>
        }
      />
    </Card>
  );
}
