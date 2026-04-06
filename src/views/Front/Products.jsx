import { useEffect, useState } from "react";
import { Link } from "react-router";
import useMessage from "../../hooks/useMessage";
import Pagination from "../../components/Pagination";
import { getProductsAllApi, getProductsForCategoriesApi } from "../../services/product.js";

const Products = () => {
  const [ products, setProducts ] = useState([]);
  const { showError } = useMessage();
  const [ categories, setCategories ] = useState([]);
  const [ currentCategory, setCurrentCategory ] = useState('全部商品');
  const [ pagination, setPagination ] = useState({});

  const getProducts = async (page=1, category) => {
    try {
      const res = await getProductsForCategoriesApi(page, category)
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      showError(error?.response?.data?.message || '取得產品資料失敗');
    }
  }

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await getProductsAllApi();
        const result = [
          '全部商品',
          ... new Set(res.data.products.map( product => product.category))
        ];
        setCategories(result);
      } catch (error) {
        showError(error?.response?.data?.message || '取得產品資料失敗');
      }
    }
    getAllProducts();
    const getProducts = async (page=1, category) => {
      try {
        const res = await getProductsForCategoriesApi(page, category)
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      } catch (error) {
        showError(error?.response?.data?.message || '取得產品資料失敗');
      }
    }
    getProducts(1, currentCategory);
  }, [currentCategory])

  return (<>
    <nav className="navbar navbar-expand-lg bg-body-light mb-5">
      <div className="container">
        <div className="collapse navbar-collapse border-bottom" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              { categories.map( category => (
                <button 
                  key={ category }
                  type="button"
                  className={`nav-link
                    ${currentCategory === category && 'active'}
                  `}
                  onClick={ e => {
                    e.preventDefault();
                    setCurrentCategory(category);
                  }}
                >{ category }
                </button> 
              )) 
              }
              </li> 
          </ul>
        </div>
      </div>
    </nav>
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
    <Pagination pagination={ pagination } onChangePage={ getProducts }/>
  </>)
}

export default Products