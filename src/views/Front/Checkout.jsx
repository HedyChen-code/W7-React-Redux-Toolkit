import { useEffect, useRef, useState } from "react";
import { currency } from "../../utils/filter";
import { useForm } from "react-hook-form";
import { Hourglass } from "react-loader-spinner";
import * as bootstrap from "bootstrap";
import SingleProductModal from "../../components/SingleProductModal";
import { addressValidation, emailValidation, nameValidation, telValidation } from "../../utils/validation";
import useMessage from "../../hooks/useMessage";
import { addOrderApi } from "../../services/order";
import { getProductsApi, getSingleProductApi } from "../../services/product";
import { addCartApi, delCartAllApi, delCartApi, getCartApi, updateCartApi } from "../../services/cart";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Checkout = () => {
  const [ tempProduct, setTempProduct ] = useState({});
  const [ products, setProducts ] = useState([]);
  const [ cart, setCart ] = useState({ cart: [], });
  const [ loadingCartId, setLoadingCartId ] = useState(null);
  const [ loadingProductId, setLoadingProductId ] = useState(null);
  const productModalRef = useRef(null);
  const { showSuccess, showError } = useMessage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm(
    { mode: "onChange" }
  );

  const onSubmit = async (formData) => {
    try {
      await addOrderApi(formData);
      getCart();
      reset();
    } catch (error) {
      showError(error?.response?.data);
    }
  }

  const openModal = () => {
    productModalRef.current.show();
  }

  const getProducts = async () => {
    try {
      const res = await getProductsApi();
      setProducts(res.data.products);
    } catch (error) {
      showError('取得產品資料失敗：', error);
    }
  }

  const getSingleProduct = async (id) => {
    setLoadingProductId(id);

    try {
      const res = await getSingleProductApi(id);
      setTempProduct(res.data.product);
      openModal()
    } catch (error) {
      showError('取得產品資料失敗：', error);
    } finally {
      setLoadingProductId(null);
    }
  }

  const closeModal = () => {
    productModalRef.current.hide();
  }

  const getCart = async () => {
    try {
      const res = await getCartApi();
      setCart(res.data.data);
    } catch (error) {
      showError(error?.response?.data || '取得購物車資料失敗');
    }
  }

  const updateCart = async (cartId, productId, qty) => {
    try {
      await updateCartApi(cartId, productId, qty);
      getCart();
    } catch (error) {
      showError(error?.response?.data);
    }
  }

  const deleteCart = async(id) => {
    try {
      await delCartApi(id);
      getCart();
      showSuccess('刪除這一筆購物車成功！')
    } catch (error) {
      showError(error?.response?.data);
    }
  }

  const deleteCartAll = async () => {
    await delCartAllApi();
    getCart();
    showSuccess('清空購物車成功！')
  }

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await getProductsApi();
        setProducts(res.data.products);
      } catch (error) {
        showError('取得產品資料失敗：', error);
      }
    }

    const getCart = async () => {
      try {
        const res = await getCartApi();
        setCart(res.data.data);
      } catch (error) {
        showError(error?.response?.data || '取得購物車資料失敗');
      }
    }

    getProducts();
    getCart();

    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false
    });

    // Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  const addCart = async (id, qty) => {
    setLoadingCartId(id);

    try {
      await addCartApi(id, qty);
      showSuccess('加入購物車成功！')
      getCart();
    } catch (error) {
      showError(error?.response?.data || '加入購物車失敗');
    } finally {
      setLoadingCartId(null); // 清除 loading 狀態
    }
  }

  return (<>
    <div className="container mt-5">

      {/* 產品列表 */}
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
                  <button  
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={ () => getSingleProduct(product.id) }
                    disabled={ loadingProductId === product.id }
                  >
                    {
                      loadingProductId === product.id ? (
                        <Hourglass
                          colors={['#A39485', '#D4C7B9']}
                          width="80"
                          height="16"
                        />
                      ) : '查看更多'
                    }
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-danger"
                    onClick={ () => addCart(product.id) }
                    disabled={ loadingCartId === product.id }
                    onMouseEnter={ (e) => e.target.style.color = "#f8f9fa" }
                    onMouseLeave={ (e) => e.target.style.color = "" }
                  >
                    {
                      loadingCartId === product.id ? (
                        <Hourglass
                          colors={['#A39485', '#D4C7B9']}
                          width="80"
                          height="16"
                        />
                      ) : '加入購物車'
                    }
                  </button>
                </div>
              </td>
            </tr>
          ))}
          
        </tbody>
      </table>

      {/* 購物車列表 */}
      <h2 className="mb-4">購物車清單</h2>
      <div className="text-end mb-2">
        <button 
          type="button" 
          className="btn btn-outline-danger"
          onMouseEnter={ (e) => e.target.style.color = "#f8f9fa" }
          onMouseLeave={ (e) => e.target.style.color = "" }
          onClick={ deleteCartAll }
          disabled={ !(cart.carts?.length > 0)}          
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
          { cart.carts && cart.carts?.length > 0 ? (
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

      {/* 填寫寄送資料 表格 */}
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
                  {...register('name', nameValidation)}
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
                  {...register('email', emailValidation)}
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
                  {...register('tel', telValidation)}
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
                  {...register('address', addressValidation)}
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
                className="btn btn-danger"
                style={{color: "white"}}
              >送出訂單</button>
            </div>
          </form>
          

        </div>
      </div>

      {/* 查看更多 開啟單一產品Modal */}
      <SingleProductModal 
        productModalRef={ productModalRef }
        tempProduct={ tempProduct }
        closeModal={ closeModal }
        getProducts={ getProducts }
        addCart={ addCart }
      />
    </div>
  </>)
}

export default Checkout