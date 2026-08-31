import apiClient from "./client";

// GET /api/cluster
export function listClusters() {
  return apiClient.get("/cluster").then((res) => res.data);
}

// PATCH /api/cluster/<id>
export function updateClusterToken(clusterId, token) {
  return apiClient
    .patch(`/cluster/${clusterId}`, { token })
    .then((res) => res.data);
}