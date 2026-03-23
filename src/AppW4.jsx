import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import "./sass/all.scss";

import Login from './views/Login';
import Navbar from './components/Navbar';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import Pagination from './components/Pagination';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

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

function AppW4
 () {
  // modal 相關
  const productModalRef = useRef(null);
  const [ modalType, setModalType ]= useState(''); // "create"/"edit"/"delete"
  const [ templateProduct, setTemplateProduct ] = useState(INITIAL_TEMPLATE_PRODUCT);

  const [ isAuth, setIsAuth ] = useState(false);
  const [ products, setProducts ] = useState([]);
  const [ pagination, setPagination ] = useState({});

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
      
  const logout = async () => {
    try {
      const response = await axios.post(`${API_BASE}/logout`);
      setIsAuth(false);
    } catch (error) {
      alert('登出失敗：' + error?.response?.data?.message || error.message);
    }
    
  }

  // 檢查管理員權限
  const checkAdmin = async () => {
    try {
      const response = await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
      getProducts();
    } catch (error) {
      alert('權限檢查失敗：', error.response?.data?.message);
      setIsAuth(false);
    }
  }

  // 頁面載入 -> 啟動 useEffect -> 從 cookie 中讀取 token -> 檢查管理員權限
  useEffect(() => {
    // 檢查登入狀態
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)jiaToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",);
    // console.log(token);
    
    if (token) {
      axios.defaults.headers.common.Authorization = token;
    }

    // const myModalAlternative = new bootstrap.Modal('#myModal', options)
    productModalRef.current  = new bootstrap.Modal('#productModal');

    // Modal 關閉時自動移除焦點
    document
      .querySelector('#productModal')
      .addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

    // 檢查管理員權限並載入資料
    checkAdmin();

  }, []);
  
  const getProducts = async (page=1) => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`)
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
    
  }

  return (
    <>
      {!isAuth ? (
        // 未登入 -> 顯示登入頁
        <Login 
          getProducts= { getProducts }
          setIsAuth={ setIsAuth }
          />
      ) : (
        // 已登入 -> 顯示後台產品列表頁
      <>
        <Navbar  logout={ logout }/>
        <ProductTable 
          openModal={ openModal }
          INITIAL_TEMPLATE_PRODUCT={ INITIAL_TEMPLATE_PRODUCT }
          products={ products }/>
      </>)}

      {/* Modal */}
      <ProductModal 
        templateProduct={ templateProduct } 
        productModalRef={ productModalRef }
        modalType={ modalType }
        closeModal={ closeModal }
        getProducts={ getProducts }
      />

      {/* Pagination */}
      <Pagination pagination={ pagination } onChangePage={ getProducts }/>
    </>
  )
}

export default AppW4
