import { http } from "@/utils/http";

export const dashboardInfo = data => {
  return http.request("post", "/api/v1/dashboard/info", { data });
};
export const dashboardData = data => {
  return http.request("post", "/api/v1/dashboard/data", { data });
};
export const streamLiveCount = data => {
  return http.request("post", "/api/v1/stream/liveCount", { data });
};
export const streamPlayerCount = data => {
  return http.request("post", "/api/v1/stream/playerCount", { data });
};
