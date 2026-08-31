import apiClient from "./client";

// GET /api/namespace?cluster_id=<id>
export function listNamespaces(clusterId) {
  return apiClient
    .get("/namespace", { params: { cluster_id: clusterId } })
    .then((res) => res.data);
}

// POST /api/namespace
export function createNamespace({ clusterId, name }) {
  return apiClient
    .post("/namespace", { cluster_id: clusterId, name })
    .then((res) => res.data);
}

// DELETE /api/namespace/<id>
export function deleteNamespace(namespaceId) {
  return apiClient.delete(`/namespace/${namespaceId}`);
}