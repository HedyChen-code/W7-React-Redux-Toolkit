import { NavLink, Outlet } from "react-router";

function AdminLayout () {
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
              <NavLink className="nav-link" to='/admin/products'>後台商品列表</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to='/admin/orders'>後台訂單列表</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  <main>
    <Outlet />
  </main>

  <footer>
    <p className="text-center text-secondary">© 2025 Jia 的網站</p>
  </footer>
  </>)
}

export default AdminLayout