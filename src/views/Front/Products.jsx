import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import useMessage from "../../hooks/useMessage";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Products = () => {
  const [ products, setProducts ] = useState([]);
  const { showError } = useMessage();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const url = `${API_BASE}/api/${API_PATH}/products`;
        const res = await axios.get(url);
        setProducts(res.data.products);
      } catch (error) {
        showError(error?.response?.data?.message || '取得產品資料失敗');
      }
    }
    getProducts();
  }, [])

  return (<>
    <div className="container">
      <div className="row">
          { products && products.length > 0 ? 
          ( products.map( product => (
            <div className="col-6 col-md-4 mb-3" key={ product.id }>
              <div className="card">
                <img src={ product.imageUrl } className="card-img-top" alt="product photo"/>
                <div className="card-body">
                  <h5 className="card-title">{ product.title }</h5>
                  <p className="card-text">
                    { product.description}
                  </p>
                  <p className="card-text">
                    價格： { product.price } 元
                  </p>
                  <p className="card-text">
                    單位： { product.unit }
                  </p>
                  <Link className="btn btn-primary" to={ `/product/${ product.id }` }>查看更多</Link>
                </div>
              </div>
            </div>
          )))  : (<p>尚無產品資料</p>)}
      </div>
    </div>
  </>)
}

export default Products