import axios from 'axios';
import { useEffect, useState } from 'react';
import { RotatingTriangles } from 'react-loader-spinner';
import useMessage from '../hooks/useMessage';
import { Navigate } from 'react-router';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 路由守衛，保護後台頁面
const ProtectRoute = ({ children }) => {
  const [ isAuth, setIsAuth ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const { showError } = useMessage();

  useEffect(() => {
    // 檢查登入狀態
    // const token = document.cookie.replace(
    //   /(?:(?:^|.*;\s*)jiaToken\s*\=\s*([^;]*).*$)|^.*$/,
    //   "$1",);

    const token = document.cookie
      .split(";")
      .find((row) => row.startsWith("jiaToken="))
      ?.split("=")[1];
    
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }

    // 檢查管理員權限並載入資料
    // 檢查管理員權限
    const checkAdmin = async () => {
      try {
        await axios.post(`${API_BASE}/api/user/check`);
        setIsAuth(true);
      } catch (error) {
        showError(error.response?.data?.message || '權限檢查失敗');
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center py-5">
      <RotatingTriangles />
    </div>)
  if (!isAuth) return <Navigate to="/login" />

  return children
}

export default ProtectRoute