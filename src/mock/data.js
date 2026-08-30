export const mockClusters = [
  {
    id: 1,
    name: 'prod-eu',
    address: 'https://k8s-prod-eu.example.com:6443',
  },
  {
    id: 2,
    name: 'staging',
    address: 'https://k8s-staging.example.com:6443',
  },
  {
    id: 3,
    name: 'dev-local',
    address: 'https://k8s-dev.example.com:6443',
  },
]

export const mockNamespaces = {
  1: [
    {
      id: 11,
      name: 'billing',
      cluster: 1,
      created_at: '2026-05-01T10:00:00Z',
    },
    {
      id: 12,
      name: 'auth',
      cluster: 1,
      created_at: '2026-05-02T10:00:00Z',
    },
  ],

  2: [
    {
      id: 21,
      name: 'staging-web',
      cluster: 2,
      created_at: '2026-05-03T10:00:00Z',
    },
  ],

  3: [],
}