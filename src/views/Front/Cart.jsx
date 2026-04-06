import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currency } from "../../utils/filter";
import useMessage from "../../hooks/useMessage";
import { createAsyncGetCart, createAsyncDelCart, createAsyncDelCartAll, createAsyncUpdateCart } from "../../slice/cartSlice";

const Cart = () => {
  // const [ cart, setCart ] = useState({ cart: [] });
  const cartState = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { showSuccess, showError } = useMessage();

  const handleUpdateCart = async (cartId, productId, qty) => {
    try {
      await dispatch(createAsyncUpdateCart({ cartId, productId, qty })).unwrap();
      showSuccess('更新購物車成功');
    } catch (error) {
      showError(error || '更新購物車失敗');
    }
  }

  const handleRemoveCart = async (e, id) => {
    e.preventDefault();

    try {
      await dispatch(createAsyncDelCart(id)).unwrap();
      showSuccess('刪除該筆購物車成功');
    } catch (error) {
      showError(error || '刪除該筆購物車失敗');
    }
    
  }

  const handleRemoveCartAll = async () => {
    try {
      await dispatch(createAsyncDelCartAll()).unwrap();
      showSuccess('清空購物車成功！')
    } catch (error) {
      showError(error || '清空購物車失敗');
    }
  }

  useEffect(() => {
    dispatch(createAsyncGetCart());
  }, [dispatch])

  return (<>
    <div className="container mt-5">
      <h2 className="mb-4">購物車清單</h2>
      <div className="text-end mb-2">
        <button 
          type="button" 
          className="btn btn-outline-danger"
          onMouseEnter={ (e) => e.target.style.color = "#f8f9fa" }
          onMouseLeave={ (e) => e.target.style.color = "" }
          onClick={ handleRemoveCartAll }
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
          { cartState.carts && cartState.carts.length > 0 ? (
            cartState.carts.map( cartItem => (
              <tr key={ cartItem.id}>
                <td>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-danger"
                    onMouseEnter={ (e) => e.target.style.color = "#f8f9fa" }
                    onMouseLeave={ (e) => e.target.style.color = "" }
                    onClick={ (e) => handleRemoveCart(e, cartItem.id) }
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
                      onChange={ (e) => handleUpdateCart(cartItem.id, cartItem.product_id, Number(e.target.value)) }
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
            <td className="text-end">{ currency(cartState.final_total) }</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </>)
}

export default Cart