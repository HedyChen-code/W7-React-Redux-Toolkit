import { adminApi, api, API_PATH } from "./api";

// 前台
export const getProductsForCategoriesApi = (page=1, category) => {
  return api.get(`/api/${API_PATH}/products`, {
    params: {
      page,
      category: category === '全部商品' ? undefined : category
    }
  });
}

export const getProductsApi = () => {
  return api.get(`/api/${API_PATH}/products`);
}

export const getProductsAllApi = () => {
  return api.get(`/api/${API_PATH}/products/all`);
}

export const getSingleProductApi = (id) => {
  return api.get(`/api/${API_PATH}/product/${id}`);
}

// 後台
export const getAdminProductsApi = (page=1) => {
  return adminApi.get(`/api/${API_PATH}/admin/products?page=${page}`);
}
export const delProductApi = (id) => {
  return adminApi.delete(`/api/${API_PATH}/admin/product/${id}`);
}

export const addProductApi = (productData) => {
  const url = `/api/${API_PATH}/admin/product`;
  return adminApi.post(url, productData);
}

export const updateProductApi = (id, productData) => {
  const url = `/api/${API_PATH}/admin/product/${id}`;
  return adminApi.put(url, productData);
}
