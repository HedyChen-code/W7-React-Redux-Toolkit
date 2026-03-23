import { RouterProvider, createHashRouter } from "react-router";
import routes from './routes/router';

import "./sass/all.scss";

const router = createHashRouter(routes);

function App() {
  return <RouterProvider router={ router } />
}

export default App;