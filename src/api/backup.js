import apiClient from "./client";

export function createBackup({ appId, sourcePath, schedule }) {
  return apiClient
    .post("/backup", {
      app_id: appId,
      source_path: sourcePath,
      ...(schedule ? { schedule } : {}),
    })
    .then((res) => res.data);
}

export function listAppBackups(appId) {
  return apiClient.get(`/backup/app/${appId}`).then((res) => res.data);
}

export function listAppSchedules(appId) {
  return apiClient.get(`/backup/schedule/app/${appId}`).then((res) => res.data);
}

export function deactivateSchedule(scheduleId) {
  return apiClient.patch(`/backup/schedule/${scheduleId}`).then((res) => res.data);
}