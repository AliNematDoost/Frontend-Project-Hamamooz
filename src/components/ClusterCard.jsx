import { useState } from "react";
import {
  ApartmentOutlined,
  CloudServerOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { Button, Card, Tag, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import ClusterTokenModal from "./ClusterTokenModal";
import { updateClusterToken } from "../api/clusters";

const { Text } = Typography;

export default function ClusterCard({ cluster }) {
  const navigate = useNavigate();

  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [updatingToken, setUpdatingToken] = useState(false);

  const handleClick = () => {
    navigate(`/clusters/${cluster.id}`);
  };

  const handleTokenClick = (event) => {
    event.stopPropagation();
    setTokenModalOpen(true);
  };

  const handleUpdateToken = async (values) => {
    setUpdatingToken(true);

    try {
      await updateClusterToken(cluster.id, values.token);
      message.success("Cluster token updated successfully");
      setTokenModalOpen(false);
    } catch (err) {
      message.error(
        err?.response?.data?.token?.[0] ??
          err?.response?.data?.detail ??
          "Failed to update token",
      );
    } finally {
      setUpdatingToken(false);
    }
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

            <div className="resource-actions">
              <Text type="secondary" style={{ fontSize: 12 }}>
                View Namespaces
              </Text>

              <Button
                type="text"
                size="small"
                className="token-button"
                icon={<KeyOutlined />}
                onClick={handleTokenClick}
              >
                Update Token
              </Button>
            </div>
          </>
        }
      />

      <ClusterTokenModal
        open={tokenModalOpen}
        loading={updatingToken}
        onUpdate={handleUpdateToken}
        onCancel={() => setTokenModalOpen(false)}
      />
    </Card>
  );
}
