import { useState, useEffect, useRef } from 'react';
import * as bootstrap from 'bootstrap';
import ProductModal from '../../components/ProductModal';
import Pagination from '../../components/Pagination';
import useMessage from '../../hooks/useMessage';
import { getAdminProductsApi } from '../../services/product';

function AdminProducts ( ) {
  const [ products, setProducts ] = useState([]);
  const productModalRef = useRef(null);
  const [ modalType, setModalType ]= useState('');
  const [ pagination, setPagination ] = useState({});
  const { showError } = useMessage();
  
  const INITIAL_TEMPLATE_PRODUCT = {
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: {
      story_title: "",
      story_content: ""
    },
    is_enabled: false,
    imagesUrl: [],
  };

  const [ templateProduct, setTemplateProduct ] = useState(INITIAL_TEMPLATE_PRODUCT);

  const openModal = (type, product) => {
    // 設定 Modal 資料內容
    setTemplateProduct({
      ...INITIAL_TEMPLATE_PRODUCT,
      ...product
    });
    // 設定 Modal 類型並顯示
    productModalRef.current.show();
    setModalType(type);
  }

  const closeModal = () => {
    productModalRef.current.hide();
  }

  const getProducts = async (page=1) => {
    try {
      const response = await getAdminProductsApi(page);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      showError(error?.response?.data?.message);
    }
    
  }

  // 頁面載入 -> 啟動 useEffect -> 從 cookie 中讀取 token -> 檢查管理員權限
  useEffect(() => {
    // const myModalAlternative = new bootstrap.Modal('#myModal', options)
    productModalRef.current  = new bootstrap.Modal('#productModal');

    // Modal 關閉時自動移除焦點
    document.querySelector('#productModal')
      .addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

    const getProducts = async (page=1) => {
      try {
        const response = await getAdminProductsApi(page);
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } catch (error) {
        // dispatch(createAsyncMessage(error.response.data));
        showError(error.response?.data?.message || "產品取得失敗");
      }
      
    }

    getProducts();

  }, []);

  return (<>
    <div className="container text-center mb-4">
      <h2 className="h3 mx-auto my-3">產品列表</h2>
      <div className="d-flex">
        <button
          type="button"
          className="btn btn-primary btn-sm px-3 py-2 ms-auto mb-3"
          onClick={ () => openModal("create", INITIAL_TEMPLATE_PRODUCT) }
        >建立新的商品</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>分類</th>
            <th>產品名稱</th>
            <th>原價</th>
            <th>售價</th>
            <th>是否啟用</th>
            <th>編輯</th>
          </tr>
        </thead>
        <tbody>
          { products && products.length > 0 ? (
            products.map( product => (
              <tr key={product.id}>
                <td>{ product.category}</td>
                <td className="text-start">{ product.title }</td>
                <td>{ product.origin_price }</td>
                <td>{ product.price }</td>
                <td>
                  <span className={ product.is_enabled ? "badge bg-primary" : "badge bg-secondary"}>{ product.is_enabled ? "啟用" : "未啟用" }</span>
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-outline-info btn-sm"
                      onClick={() => openModal("edit", product)}
                    >編輯</button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => openModal("delete", product)}
                      onMouseEnter={ e => e.currentTarget.classList.add("text-light")}
                      onMouseLeave={ e => e.currentTarget.classList.remove("text-light")}
                    >刪除</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">尚無產品資料</td>
            </tr>
          ) }
        </tbody>
      </table>
      
      <ProductModal 
        templateProduct={ templateProduct }
        productModalRef={ productModalRef } 
        modalType={ modalType }
        closeModal={ closeModal }
        getProducts={ getProducts }
      />

      <Pagination pagination={ pagination } onChangePage={ getProducts }/>
    </div>
  </>)
}

export default AdminProducts