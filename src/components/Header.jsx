import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router";

const Header = () => {
  const cartState = useSelector(state => state.cart);

  return (<>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <a className="navbar-brand" href="#">我是 Logo</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to='/'>首頁</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to='/products'>商品列表</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to='/product'>商品詳細</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to='/cart'>購物車</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to='/checkout'>結帳</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to='/login'>登入</NavLink>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item me-3">
              <a className="nav-link p-0">
                <i className="bi bi-heart-fill fs-5"></i>
              </a>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="nav-link position-relative p-0">
                <i className="bi bi-cart-fill fs-5"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  { cartState.carts.length }
                  <span className="visually-hidden">unread messages</span>
                </span>
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  </>)
}

export default Header