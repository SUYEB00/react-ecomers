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
import TermsOfUse from "./components/TermsOfUse";
import PrivacyPolicy from "./components/PrivacyPolicy";

// ⬅⬅⬅ ADD THIS IMPORT
import { CartProvider } from "./context/CartContext";
import Cart from "./Pages/Cart";
import ProductDetails from "./Pages/ProductDetailsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/ordermanagement",
    element: <OrderManagment />,
  },
  {
    path: "/messagemanagement",
    element: <MessageManagement />,
  },
  {
    path: "/usermanagement",
    element: <UserManagement />,
  },
  {
    path: "/terms",
    element: <TermsOfUse />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/cart",
    element: <Cart></Cart>,
  },
  ,
  {
    path: "/product/:id",
    element: 
    <ProductDetails></ProductDetails>,
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <CartProvider>
    <RouterProvider router={router} />
  </CartProvider>
);
