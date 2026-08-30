import { Col, Row } from "antd";

import AppCard from "./AppCard";

export default function AppList({ apps, onAppClick }) {
  return (
    <Row gutter={[16, 16]}>
      {apps.map((app) => (
        <Col key={app.id} xs={24} sm={12} lg={8}>
          <AppCard app={app} onClick={() => onAppClick(app)} />
        </Col>
      ))}
    </Row>
  );
}
