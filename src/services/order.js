import { api, API_PATH } from "./api";

export const addOrderApi = (formData) => {
  const url = `/api/${API_PATH}/order`;
  const data = {
    data: {
      user: formData,
      message: formData.message
    }
  };

  return api.post(url, data);
}