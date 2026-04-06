import { api, API_PATH } from "./api"


export const getCartApi = () => {
  return api.get(`/api/${API_PATH}/cart`)
}

export const addCartApi = (id, qty=1) => {
  const data = {
    product_id: id,
    qty
  };
  const url = `/api/${API_PATH}/cart`;

  return api.post(url, { data });
}

export const delCartApi = (id) => {
  return api.delete(`/api/${API_PATH}/cart/${id}`);
}

export const delCartAllApi = () => {
  return api.delete(`/api/${API_PATH}/carts`);
}

export const updateCartApi = (cartId, productId, qty=1) => {
  const url = `/api/${API_PATH}/cart/${cartId}`;
  const data = {
    product_id: productId,
    qty
  };

  return api.put(url, { data });
}