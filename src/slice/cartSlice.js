import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addCartApi, delCartAllApi, delCartApi, getCartApi, updateCartApi } from "../services/cart";

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    carts: [],
    total: 0,
    final_total: 0,
  },
  // action
  reducers: {
    updateCart(state, action) {
      state.carts = action.payload.carts;
      state.total = action.payload.total;
      state.final_total = action.payload.final_total;
    }
  },
});

export const createAsyncGetCart = createAsyncThunk(
  'cart/createAsyncGetCart',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await getCartApi();
      dispatch(updateCart(res.data.data));
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message|| "取得購物車失敗"
      )
    }
  }
)

export const createAsyncAddCart = createAsyncThunk(
  'cart/createAsyncAddCart',
  async ({id, qty}, { dispatch, rejectWithValue }) => {
    try {
      await addCartApi(id, qty);
      dispatch(createAsyncGetCart());
      return { success: true }
    } catch (error) {
      return rejectWithValue( error?.response?.data?.message|| "加入購物車失敗");
    }
  }
)

export const createAsyncDelCart = createAsyncThunk(
  'cart/createAsyncDelCart',
  async ( id, { dispatch, rejectWithValue }) => {
    try {
      await delCartApi(id);
      dispatch(createAsyncGetCart());
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "刪除該筆購物車失敗");
    }
  }
)

export const createAsyncDelCartAll = createAsyncThunk(
  'cart/createAsyncDelCartAll',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await delCartAllApi();
      dispatch(createAsyncGetCart());
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || '清空購物車失敗');
    }
  }
)

export const createAsyncUpdateCart = createAsyncThunk(
  'cart/createAsyncUpdateCart',
  async ({ cartId, productId, qty }, { dispatch, rejectWithValue }) => {
    try {
      await updateCartApi(cartId, productId, qty);
      dispatch(createAsyncGetCart());
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || '更新購物車失敗');
    }
  }
)

export const { updateCart } = cartSlice.actions;

export default cartSlice.reducer