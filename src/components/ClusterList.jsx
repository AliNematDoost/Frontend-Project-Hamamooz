import { Col, Row } from "antd";

import ClusterCard from "./ClusterCard";

export default function ClusterList({ clusters }) {
  return (
    <Row gutter={[16, 16]}>
      {clusters.map((cluster) => (
        <Col key={cluster.id} xs={24} sm={12} lg={8}>
          <ClusterCard cluster={cluster} />
        </Col>
      ))}
    </Row>
  );
}
