import apiClient from "./client";

// GET /api/app?namespace_id=<id>
export function listApps(namespaceId) {
  return apiClient
    .get("/app", { params: { namespace_id: namespaceId } })
    .then((res) => res.data);
}

// POST /api/app
export function createApp({ namespaceId, name, image, replicas, cpu, memory }) {
  return apiClient
    .post("/app", { namespace_id: namespaceId, name, image, replicas, cpu, memory })
    .then((res) => res.data);
}

// PATCH /api/app/<id>
export function updateApp(appId, { cpu, memory, replicas }) {
  return apiClient
    .patch(`/app/${appId}`, { cpu, memory, replicas })
    .then((res) => res.data);
}

// DELETE /api/app/<id>
export function deleteApp(appId) {
  return apiClient.delete(`/app/${appId}`);
}