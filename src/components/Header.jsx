import { NavLink } from "react-router";

const Header = () => {
  return (<>
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-5">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">我是 Logo</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
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
        </div>
      </div>
    </nav>
  </>)
}

export default Header