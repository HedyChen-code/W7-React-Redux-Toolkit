import { RouterProvider, createHashRouter } from "react-router";
import routes from './routes/router';

import axios from "axios";
import * as bootstrap from 'bootstrap';
import "./sass/all.scss";

const router = createHashRouter(routes);

function AppW5() {
  return <RouterProvider router={ router } />
}

export default AppW5;