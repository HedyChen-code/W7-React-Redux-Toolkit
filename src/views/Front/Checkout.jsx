import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";
import { useForm } from "react-hook-form";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Checkout = () => {
  const [ products, setProducts ] = useState([]);
  const [ cart, setCart ] = useState({ cart: [], });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(
    { mode: "onChange" }
  );

  const onSubmit = async (formData) => {
    console.log('表單資料：', formData);
    try {
      const url = `${API_BASE}/api/${API_PATH}/order`;
      const data = {
        data: {
          user: formData,
          message: formData.message
        }
      }
      await axios.post(url, data);
      getCart();
      reset();
    } catch (error) {
      alert(error?.response?.data);
    }
  }

  const getCart = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      const res = await axios.get(url);
      console.log(res.data.data);
      setCart(res.data.data);
    } catch (error) {
      alert('取得購物車資料失敗：', error?.response?.data);
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
      alert(error?.response?.data);
    }
  }

  const deleteCart = async(id) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${id}`;
      await axios.delete(url);
      getCart();
      alert('刪除這一筆購物車成功！')
    } catch (error) {
      alert(error?.response?.data);
    }
  }

  const deleteCartAll = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/carts`;
      await axios.delete(url);
      getCart();
      alert('清空購物車成功！')
    } catch (error) {
      alert(error?.response?.data?.message || '清空購物車失敗');
    }
    
  }

  useEffect(() => {
    const getProducts = async () => {
      try {
        const url = `${API_BASE}/api/${API_PATH}/products`;
        const res = await axios.get(url);
        console.log(res);
        setProducts(res.data.products);
      } catch (error) {
        alert('取得產品資料失敗：', error);
      }
    }
    
    getProducts();
    getCart();
  }, [])

  const addCart = async (id, qty=1) => {
    const data = {
      product_id: id,
      qty
    };
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      const res = await axios.post(url, { data });
      console.log(res);
      alert('加入購物車成功！')
      getCart();
    } catch (error) {
      alert('加入購物車失敗：', error?.response?.data);
    }
  }

  return (<>
    <div className="container">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { products.map( product => (
            <tr key={ product.id }>
              <td style={{ width: "200px" }}>
                <div
                  style={{
                    height: "100px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${ product.imageUrl })`,
                  }}
                ></div>
              </td>
              <td>{ product.title }</td>
              <td>
                <del className="h6">原價：{ product.origin_price }</del>
                <div className="h5">特價：{ product.price }</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button type="button" className="btn btn-outline-secondary">
                    {/* <i className="fas fa-spinner fa-pulse"></i> */}
                    查看更多
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-danger"
                    onClick={ () => addCart(product.id) }
                    onMouseEnter={ (e) => e.target.style.color = "#f8f9fa" }
                    onMouseLeave={ (e) => e.target.style.color = "" }
                  >
                    加入購物車
                  </button>
                </div>
              </td>
            </tr>
          ))}
          
        </tbody>
      </table>

      <h2 className="mb-4">購物車清單</h2>
      <div className="text-end mb-2">
        <button 
          type="button" 
          className="btn btn-outline-danger disabled-cursor"
          onMouseEnter={ (e) => e.target.style.color = "#f8f9fa" }
          onMouseLeave={ (e) => e.target.style.color = "" }
          onClick={ deleteCartAll }
          disabled={ !(cart.carts.length > 0)}
        >
          清空購物車
        </button>
      </div>

      <table className="table table-hover mb-6">
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

      <div className="row justify-content-center my-5">
        <div className="col-md-8 border border-3 px-3 py-5">
          <h3 className="mb-5 text-center">請填寫寄送資料</h3>
          <form onSubmit={ handleSubmit(onSubmit) }>
            <div className="col-md-10 mx-auto">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">收件人姓名</label>
                <input 
                  id="name"
                  name="name" 
                  type="text"
                  className={`form-control ${errors.name && 'is-invalid'}`}
                  placeholder="請輸入姓名"
                  {...register('name', {
                    required: "請輸入收件人姓名",
                    minLength: {
                      value: 2,
                      message: "姓名至少 2 個字"
                    }
                  })}
                />
                { errors.name && 
                  (<p className="invalid-feedback">{ errors?.name?.message }</p>) 
                }
              </div>
            </div>

            <div className="col-md-10 mx-auto">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">email</label>
                <input 
                  id="email"
                  name="email" 
                  type="email"
                  className={`form-control ${errors.email && 'is-invalid'}`}
                  placeholder="請輸入 Email"
                  {...register('email', {
                    required: "請輸入 Email",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Email 格式不正確"
                    }
                  })}
                />
                { errors.email && 
                  (<p className="invalid-feedback">{ errors?.email?.message }</p>)
                }
              </div>
            </div>

            <div className="col-md-10 mx-auto">
              <div className="mb-3">
                <label htmlFor="tel" className="form-label">收件人電話</label>
                <input 
                  id="tel"
                  name="tel" 
                  type="tel"
                  className={`form-control ${errors.tel && 'is-invalid'}`}
                  placeholder="請輸入電話"
                  {...register('tel', {
                    required: "請輸入收件人電話",
                    minLength: {
                      value: 8,
                      message: "電話至少 8 碼"
                    },
                    pattern: {
                      value: /^\d+$/,
                      message: "電話僅能輸入數字"
                    }
                  })}
                />
                { errors.tel && 
                  (<p className="invalid-feedback">{ errors?.tel?.message }</p>)
                }
              </div>
            </div>

            <div className="col-md-10 mx-auto">
              <div className="mb-3">
                <label htmlFor="address" className="form-label">收件人地址</label>
                <input 
                  id="address"
                  name="address" 
                  type="text"
                  className={`form-control ${errors.address && 'is-invalid'}`}
                  placeholder="請輸入地址"
                  {...register('address', {
                    required: "請輸入收件人地址",
                  })}
                />
                { errors.address && 
                  (<p className="invalid-feedback">{ errors?.address?.message }</p>)
                }
              </div>
            </div>

            <div className="col-md-10 mx-auto mb-5">
              <div className="mb-3">
                <label htmlFor="message" className="form-label">留言</label>
                <textarea 
                  id="message"
                  name="message" 
                  type="email"
                  className="form-control"
                  cols="30"
                  rows="10"
                  {...register('message')}
                />
              </div>
            </div>

            <div className="text-center">
              <button 
                type="submit" 
                className="btn btn-danger disabled-cursor"
                style={{color: "white"}}
                disabled={ !(cart.carts.length >0) }
              >送出訂單</button>
            </div>
          </form>
          

        </div>
      </div>
    </div>
  </>)
}

export default Checkout