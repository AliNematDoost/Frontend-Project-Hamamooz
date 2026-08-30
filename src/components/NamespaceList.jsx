import { Col, Row } from "antd";

import NamespaceCard from "./NamespaceCard";

export default function NamespaceList({ namespaces, clusterId }) {
  return (
    <Row gutter={[16, 16]}>
      {namespaces.map((namespace) => (
        <Col key={namespace.id} xs={24} sm={12} lg={8}>
          <NamespaceCard namespace={namespace} clusterId={clusterId} />
        </Col>
      ))}
    </Row>
  );
}
