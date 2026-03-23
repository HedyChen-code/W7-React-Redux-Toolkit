function Navbar ( { logout} ) {
  return (<>
    <nav className="border py-3">
          <div className="container">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              id="logout"
              onClick={ logout }
              onMouseEnter={(e) => e.target.style.color = "#f8f9fa"}
              onMouseLeave={(e) => e.target.style.color = ""}
            >
              登出
            </button>
          </div>
        </nav>
  </>)
}

export default Navbar