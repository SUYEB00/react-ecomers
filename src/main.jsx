import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Root from "./Layouts/Root";
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";
import Admin from "./Management/Admin";
import Checkout from "./components/Checkout";
import Products from "./Pages/Products";
import Orders from "./Pages/Orders";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import OrderManagment from "./Management/OrderManagment";
import MessageManagement from "./Management/MessageManagement";
import UserManagement from "./Management/UserManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/signup",
    element: <Signup></Signup>,
  },
  {
    path: "/admin",
    element: <Admin></Admin>,
  },
  {
    path: "/checkout",
    element: <Checkout></Checkout>,
  },
  {
    path: "/orders",
    element: <Orders></Orders>,
  },
  {
    path: "/products",
    element: <Products></Products>,
  },
  {
    path: "/about",
    element: <About></About>,
  },
  {
    path: "/contact",
    element: <Contact></Contact>,
  },
  {
    path: "/ordermanagement",
    element: <OrderManagment></OrderManagment>,
  },
  {
    path: "/messagemanagement",
    element: <MessageManagement></MessageManagement>,
  },
  {
    path: "/usermanagement",
    element: <UserManagement></UserManagement>,
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
