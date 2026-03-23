import { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login ( { getProducts, setIsAuth } ) {

  const [ formData, setFormData ] = useState({
    username: "lifesunny719@gmail.com",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // React 自動傳入當前 state 值 setState((當前狀態) => (新狀態))
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { expired, token } = response.data;
      // MDN: document.cookie = "someCookieName=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      document.cookie = `jiaToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;

      getProducts();
      setIsAuth(true);

    } catch (error) {
      alert('登入失敗：' + error?.response?.data?.message);
    }
  }

  return (<>
    <div className="container text-center min-vh-100">
          <div className="row login d-flex flex-column justify-content-center align-items-center min-vh-100">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-md-8">
              <form id="form" 
                className="w-100 mx-auto p-3 col-md-6 col-lg-4"
                style={{ maxWidth: "350px" }}
                onSubmit={ handleSubmit }
                >
                <div className="form-floating mb-3">
                  <input 
                    type="email"
                    className="form-control"
                    id="username"
                    name="username"
                    placeholder="test@example.com"
                    value={ formData.username }
                    onChange={ handleInputChange }
                    required
                    autoFocus />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input 
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={ formData.password }
                    onChange={ handleInputChange }
                    required />
                  <label htmlFor="password">Password</label>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">登入</button>
              </form>
            </div>
          </div>
        </div>
  </>)
}

export default Login