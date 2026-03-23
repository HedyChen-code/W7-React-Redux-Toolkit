import FrontendLayout from "../layout/FrontendLayout";
import Cart from "../views/Front/Cart";
import Checkout from "../views/Front/Checkout";
import Home from "../views/Front/Home";
import NotFound from "../views/Front/NotFound";
import Products from "../views/Front/Products";
import SingleProducts from "../views/Front/SingleProduct";
import Login from "../views/Front/Login";
import ProductTabel from "../components/ProductTable"


const routes = [
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      {
        index: true, // 預設首頁
        element: <Home />
      },
      {
        path: '/products',
        element: <Products />
      },
      {
        path: '/product/:id',
        element: <SingleProducts />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/checkout',
        element: <Checkout />
      },
      {
        path: '/login',
        element: <Login />
      },
    ]
  },
  {
    path: '/admin',
    element: <ProductTabel />
  },
  {
    path: '*',
    element: <NotFound />
  }
]

export default routes