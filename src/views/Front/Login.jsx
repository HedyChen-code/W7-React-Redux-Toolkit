import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login ( { getProducts, setIsAuth } ) {

  const [ formData, setFormData ] = useState({
    username: "lifesunny719@gmail.com",
    password: ""
  });

  const navigate = useNavigate();

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   // React 自動傳入當前 state 值 setState((當前狀態) => (新狀態))
  //   setFormData(prevData => ({
  //     ...prevData,
  //     [name]: value
  //   }))
  // }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
     mode: "onChange",
     defaultValues: { 
      username: 'lifesunny719@gmail.com' 
      }
    },
  );

  const onSubmit = async (data) => {
    // e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, data);
      const { expired, token } = response.data;
      // MDN: document.cookie = "someCookieName=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      document.cookie = `jiaToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;

      navigate('/admin/products');

      // getProducts();
      // setIsAuth(true);

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
                onSubmit={ handleSubmit(onSubmit) }
                >
                <div className="form-floating mb-3">
                  <input 
                    type="email"
                    className={`form-control ${ errors.username && 'is-invalid'}`}
                    id="username"
                    name="username"
                    placeholder="test@example.com"
                    // defaultValue={ formData.username }
                    // onChange={ handleInputChange }
                    autoFocus
                    {...register('username', {
                      required: "請輸入 Email",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Email 格式不正確"
                      }
                    })}
                  />
                  <label htmlFor="username">Email address</label>
                  { errors.username && 
                    (<p className="invalid-feedback">{ errors?.username?.message }</p>)
                  }
                </div>
                <div className="form-floating mb-3">
                  <input 
                    type="password"
                    className={`form-control ${ errors.password && 'is-invalid'}`}
                    id="password"
                    name="password"
                    placeholder="Password"
                    // defaultValue={ formData.password }
                    // onChange={ handleInputChange }
                    {...register('password', {
                      required: "請輸入密碼",
                      minLength: {
                        value: 6,
                        message: "密碼長度至少需 6 碼"
                      }, 
                      maxLength: {
                        value: 12,
                        message: "密碼長度至多 12 碼"
                      }
                    })}
                  />
                  <label htmlFor="password">Password</label>
                  { errors.password && 
                    (<p className="invalid-feedback">{ errors?.password?.message }</p>)
                  }
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">登入</button>
              </form>
            </div>
          </div>
        </div>
  </>)
}

export default Login