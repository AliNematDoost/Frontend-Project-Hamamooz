import { ApartmentOutlined, CloudServerOutlined } from '@ant-design/icons'
import { Card, Tag, Typography } from 'antd'

const { Text } = Typography

export default function ClusterCard({ cluster }) {
  return (
    <Card
      hoverable
      style={{
        borderRadius: 12,
        height: '100%',
      }}
    >
      <Card.Meta
        avatar={
          <CloudServerOutlined
            style={{
              fontSize: 28,
              color: '#1677ff',
            }}
          />
        }
        title={cluster.name}
        description={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginTop: 8,
            }}
          >
            <Text type="secondary" ellipsis>
              {cluster.address}
            </Text>

          </div>
        }
      />
    </Card>
  )
}