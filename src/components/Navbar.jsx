import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useCart } from "../context/CartContext";

import { FiShoppingCart, FiUser } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineClipboardList, HiOutlineShoppingBag } from "react-icons/hi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { RiCustomerService2Line } from "react-icons/ri";

export default function Navbar() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);
  const adminEmail = "suaibhasan845@gmail.com";
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/products?search=${searchTerm}`);
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setIsAdmin(u?.email === adminEmail);
    });
    return unsub;
  }, []);

  const logout = async () => {
    await signOut(auth);
    navigate("/");
    setShowPopup(false);
  };

  const handleUserClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 font-mon">
      {/* SEARCH BAR (center like Evaly) */}
      <div className="w-full flex justify-center border-b border-gray-200">
        <form
          onSubmit={handleSearch}
          className="flex items-center w-11/12 max-w-2xl bg-gray-100 border border-gray-300 rounded-full px-4 py-2 my-3"
        >
          <input
            type="search"
            placeholder="Search products..."
            className="bg-transparent w-full outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-black text-white px-4 py-1.5 rounded-full text-sm">
            Search
          </button>
        </form>
      </div>

      {/* MAIN NAV */}
      <div className="w-11/12 mx-auto py-4 flex items-center justify-between gap-4">
        {/* LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="text-3xl font-bold cursor-pointer"
        >
          TRENDZONE
        </h1>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-5">
          {/* CART ICON */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <FiShoppingCart className="text-2xl" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 w-5 h-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>

          {/* USER ICON */}
          <div className="relative cursor-pointer" onClick={handleUserClick}>
            <FiUser className="text-2xl" />

            {user && showPopup && (
              <div className="absolute right-0 top-10 bg-white w-56 p-4 shadow-lg rounded-xl">
                <p className="text-sm break-all">{user.email}</p>

                {isAdmin && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="mt-3 w-full bg-black text-white py-2 rounded-lg"
                  >
                    Admin Panel
                  </button>
                )}

                <button
                  onClick={() => navigate("/orders")}
                  className="mt-3 w-full bg-black text-white py-2 rounded-lg"
                >
                  Order History
                </button>

                <button
                  onClick={logout}
                  className="mt-3 w-full bg-black text-white py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM MENU */}
      <div className="bg-white border-t border-gray-200 py-2 flex justify-center">
        <ul className="flex gap-2 lg:gap-6 text-sm">
          <li
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-black flex items-center gap-1"
          >
            <AiOutlineHome className="text-2xl" />
            Home
          </li>

          <li
            onClick={() => navigate("/products")}
            className="cursor-pointer hover:text-black flex items-center gap-1"
          >
            <HiOutlineShoppingBag className="text-2xl" />
            Shops
          </li>

          <li
            onClick={() => navigate("/orders")}
            className="cursor-pointer hover:text-black flex items-center gap-1"
          >
            <HiOutlineClipboardList className="text-2xl" />
            Orders
          </li>

          <li
            onClick={() => navigate("/about")}
            className="cursor-pointer hover:text-black flex items-center gap-1"
          >
            <IoInformationCircleOutline className="text-2xl" />
            About
          </li>

          <li
            onClick={() => navigate("/contact")}
            className="cursor-pointer hover:text-black flex items-center gap-1"
          >
            <RiCustomerService2Line className="text-2xl" />
            Contact
          </li>
        </ul>
      </div>
    </div>
  );
}
