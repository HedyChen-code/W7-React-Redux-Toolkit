import { adminApi, API_PATH } from "./api";

export const uploadImageApi = (formData) => {
  const url = `/api/${API_PATH}/admin/upload`
  return adminApi.post(url, formData);
}