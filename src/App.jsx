import { RouterProvider, createHashRouter } from "react-router";
import routes from './routes/router';

import "./sass/all.scss";
import MessageToast from "./components/MessageToast";

const router = createHashRouter(routes);

function App() {
  return (
    <>
      <MessageToast />
      <RouterProvider router={ router } />
    </>
  )
}

export default App;