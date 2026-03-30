import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";
import useMessage from "../../hooks/useMessage";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Cart = () => {
  const [ cart, setCart ] = useState({ cart: [] });
  const { showSuccess, showError } = useMessage();

  const getCart = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      const res = await axios.get(url);
      showSuccess(res.data.data);
      setCart(res.data.data);
    } catch (error) {
      showError('取得購物車資料失敗：', error?.response?.data);
    }
  }

  const updateCart = async (cartId, productId, qty=1) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${cartId}`;
      const data = {
        product_id: productId,
        qty
      }
      await axios.put(url, { data });
      getCart();
    } catch (error) {
      showError(error?.response?.data);
    }
  }

  const deleteCart = async(id) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${id}`;
      await axios.delete(url);
      getCart();
      showSuccess('刪除這一筆購物車成功！')
    } catch (error) {
      showError(error?.response?.data);
    }
  }

  const deleteCartAll = async () => {
    const url = `${API_BASE}/api/${API_PATH}/cart`;
    await axios.delete(url);
    getCart();
    showSuccess('清空購物車成功！')
  }

  useEffect(() => {
    const getCart = async () => {
      try {
        const url = `${API_BASE}/api/${API_PATH}/cart`;
        const res = await axios.get(url);
        showSuccess(res.data.data);
        setCart(res.data.data);
      } catch (error) {
        showError('取得購物車資料失敗：', error?.response?.data);
      }
    }
    getCart();
  }, [getCart])

  return (<>
    <div className="container">
      <h2 className="mb-4">購物車清單</h2>
      <div className="text-end mb-2">
        <button 
          type="button" 
          className="btn btn-outline-danger"
          onMouseEnter={ (e) => e.target.style.color = "#f8f9fa" }
          onMouseLeave={ (e) => e.target.style.color = "" }
          onClick={ deleteCartAll }
        >
          清空購物車
        </button>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col" style={{width: "15%"}}></th>
            <th scope="col" style={{width: "40%"}}>品名</th>
            <th scope="col" style={{width: "30%"}}>數量 / 單位</th>
            <th scope="col" style={{width: "15%"}}>小計</th>
          </tr>
        </thead>
        <tbody>
          { cart.carts && cart.carts.length > 0 ? (
            cart.carts.map( cartItem => (
              <tr key={ cartItem.id}>
                <td>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-danger"
                    onMouseEnter={ (e) => e.target.style.color = "#f8f9fa" }
                    onMouseLeave={ (e) => e.target.style.color = "" }
                    onClick={ () => deleteCart(cartItem.id) }
                  >
                    刪除
                  </button>
                </td>
                <td>{ cartItem.product.title }</td>
                <td>
                  <div className="input-group mb-3">
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="cart-product-num" 
                      aria-label="cart-product-num" 
                      aria-describedby="cart-product-num" 
                      defaultValue={ cartItem.qty }
                      onChange={ (e) => updateCart(cartItem.id, cartItem.product_id, Number(e.target.value)) }
                    />
                    <span className="input-group-text" id="cart-product-num">
                      { cartItem.product.unit }
                    </span>
                  </div>
                </td>
                <td className="text-end">{ currency(cartItem.final_total) }</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">尚無購物車資料</td>
            </tr>
          ) }
          
        </tbody>
        <tfoot>
          <tr className="table-dark">
            <td className="text-end" colSpan="3">總計</td>
            <td className="text-end">{ currency(cart.final_total) }</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </>)
}

export default Cart