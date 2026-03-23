import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const SingleProduct = () => {
  const [ tempProduct, setTempProduct ] = useState({});
  const params = useParams();
  const { id } = params;
  

  const getSingleProduct = async (id) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/product/${id}`;
      const res = await axios.get(url);
      setTempProduct(res.data.product);
    } catch (error) {
      alert('取得產品資料失敗：', error);
    }
  }

  useEffect(() => {
    getSingleProduct(id);
  }, [id]);

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
    } catch (error) {
      alert('加入購物車失敗：', error?.response?.data);
    }
  }

  return (<>
    <div className="container">
      <div className="row">
        <div className="col-md-8 mb-3 ">
          { tempProduct ?
          (<div className="card">
            <div className="card-body mx-auto py-4">
              <img src={ tempProduct.imageUrl } 
              className="img-fluid img-thumbnail mx-auto mb-3"
               style={{width: 600}}
              alt="product photo"/>
              <h5 className="bg-secondary px-2 py-1 mb-3">商品詳細</h5>
              <h5 className="card-title mb-3">{ tempProduct.title }</h5>
              <p className="card-text">
                分類：{ tempProduct.category}
              </p>
              <p className="card-text">
                風格{ tempProduct.style}
              </p>
              <p className="card-text">
                顏色{ tempProduct.color}
              </p>
              <p className="card-text">
                材質{ tempProduct.material}
              </p>
              <p className="card-text">
                商品描述：{ tempProduct.description}
              </p>
              <p className="card-text">
                價格： { tempProduct.price } 元
              </p>
              <p className="card-text">
                單位： { tempProduct.unit }
              </p>
            </div>
          </div>)
          : (<p>尚無產品資料</p>)}
        </div> 
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="bg-secondary px-2 py-1 mb-3">商品簡介</h5>
              <div className="mb-3 px-2">
                <h6 className="card-title mb-2">{ tempProduct.title }</h6>
                <p className="card-text mb-1">
                  分類：{ tempProduct.category}
                </p>
                <p className="card-text mb-1">
                  風格：{ tempProduct.style}
                </p>
              </div>
              <h5 className="bg-secondary px-2 py-1 mb-3">商品故事</h5>
              <div className="mb-3 px-2">
                <h6 className="card-title">{tempProduct?.content?.story_title}</h6>
                <p className="card-subtitle mb-2 text-body-secondary">「{tempProduct?.content?.story_content}」</p>
              </div>
              <hr/>
              <div>
                <button 
                  type="button" 
                  className="btn btn-outline-primary me-2" 
                  onClick={ () => addCart(id) }
                >
                  加入購物車
                </button>
                <button type="button" className="btn btn-primary">直接購買</button>
              </div>
            </div>
            </div>
        </div>
      </div>
    </div>
    {/* {JSON.stringify(tempProduct)} */}
  </>)
  }

export default SingleProduct