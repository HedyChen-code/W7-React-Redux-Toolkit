import { adminApi, API_PATH } from "./api";

export const signinApi = (data) => {
  return adminApi.post(`/admin/signin`, data);
}

export const authCheckApi = () => {
  return adminApi.post(`/api/user/check`)
}