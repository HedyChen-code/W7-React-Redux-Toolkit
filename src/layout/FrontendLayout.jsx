import { Outlet } from "react-router";
import Header from "../components/Header";

function FrontendLayout () {
  return (<>
  <Header />

  <main>
    <Outlet />
  </main>

  <footer>
    <p className="text-center text-secondary">© 2025 Jia 的網站</p>
  </footer>
  </>)
}

export default FrontendLayout