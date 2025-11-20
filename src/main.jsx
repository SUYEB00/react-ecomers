import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Root from "./Layouts/Root"
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

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
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  
    <RouterProvider router={router} />

);
