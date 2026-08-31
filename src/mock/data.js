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

export const mockApps = {
    11: [
        {
            id: 101,
            name: 'billing-api',
            namespace: 'billing',
            namespace_id: 11,
            image: 'nginx:latest',
            replicas: 3,
            cpu: '500m',
            memory: '512Mi',
            ready: true,
            pods: [
                {
                    name: 'billing-api-abc12',
                    ready: true,
                },
                {
                    name: 'billing-api-abc13',
                    ready: true,
                },
                {
                    name: 'billing-api-abc14',
                    ready: true,
                },
            ],
        },
        {
            id: 102,
            name: 'billing-worker',
            namespace: 'billing',
            namespace_id: 11,
            image: 'nginx:1.27',
            replicas: 2,
            cpu: '250m',
            memory: '256Mi',
            ready: false,
            pods: [
                {
                    name: 'billing-worker-abc21',
                    ready: true,
                },
                {
                    name: 'billing-worker-abc22',
                    ready: false,
                },
            ],
        },
    ],

    12: [],

    21: [],
}

export const mockBackups = {
  101: [
    {
      backup_id: "bkp_1",
      status: "completed",
      pod_name: "billing-api-abc12",
      output_path: "/backups/billing-api/2026-08-20.tar.gz",
      error: "",
      is_scheduled: false,
    },
    {
      backup_id: "bkp_2",
      status: "failed",
      pod_name: "billing-api-abc13",
      output_path: "",
      error: "no space left on device",
      is_scheduled: true,
    },
  ],
  102: [],
}

export const mockSchedules = {
  101: [
    {
      schedule_backup_id: "sch_1",
      schedule: "0 2 * * *",
      source_path: "/var/lib/mysql",
      created_at: "2026-08-01T02:00:00Z",
      active: true,
    },
  ],
  102: [],
}