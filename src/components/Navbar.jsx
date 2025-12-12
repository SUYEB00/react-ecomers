import { useNavigate } from "react-router-dom";
import { IoInformationCircleOutline, IoPersonOutline } from "react-icons/io5";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { CiMenuBurger, CiShoppingCart } from "react-icons/ci";
import { FiLogIn, FiLogOut, FiUserPlus } from "react-icons/fi";
import { RiCustomerService2Line } from "react-icons/ri";
import { HiOutlineClipboardList, HiOutlineShoppingBag } from "react-icons/hi";
import { AiOutlineHome } from "react-icons/ai";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const adminEmail = "suaibhasan845@gmail.com";
  const [isAdmin, setIsAdmin] = useState(false);

  const { cart } = useCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const link = (
    <>
      <li
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <AiOutlineHome className="text-lg" />
        Home
      </li>

      <li
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <HiOutlineShoppingBag className="text-lg" />
        Product
      </li>

      <li
        onClick={() => navigate("/orders")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <HiOutlineClipboardList className="text-lg" />
        Orders
      </li>

      <li
        onClick={() => navigate("/about")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <IoInformationCircleOutline className="text-lg" />
        About
      </li>

      <li
        onClick={() => navigate("/contact")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <RiCustomerService2Line className="text-lg" />
        Contact
      </li>
    </>
  );

  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Only one handleSearch function
  const handleSearch = (e) => {
    e.preventDefault(); // prevent page reload
    if (!searchTerm) return;
    navigate(`/products?search=${searchTerm}`);
  };

  // Keep user logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // null if not logged in
      setIsAdmin(user?.email === adminEmail);
    });
    return unsubscribe;
  }, []);

  const handleIconClick = () => {
    setShowPopup((prev) => !prev); // just toggle dropdown
  };

  const logout = async () => {
    await signOut(auth);
    setShowPopup(false);
    navigate("/");
  };

  return (
    <div className="navbar shadow-md #faf6f1 backdrop-blur-md text-[#202020] fixed top-0 left-0 right-0 z-100 font-mon">
      <div className="w-11/12 mx-auto flex justify-between items-center py-5">
        <div className="navbar-start">
          <div className="flex items-center gap-10">
            <a
              onClick={() => navigate("/")}
              className="lg:text-4xl sm:text-2xl font-mon font-bold text-[#000000]"
            >
              TRENDZONE
            </a>
            <div className="navbar-center hidden lg:flex">
              <ul className="flex gap-6">{link}</ul>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="navbar-end flex gap-2 md:gap-6 lg:gap-6 justify-center">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white/10 rounded-full w-180 px-3 py-2 border border-[#D1D5DC]"
          >
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm text-[#202020] placeholder-[#202020] w-15 md:w-40 sm:flex"
            />
          </form>

          <div>
            {/* CART ICON */}
            <div
              className="relative text-black"
              onClick={() => navigate("/cart")}
            >
              <CiShoppingCart className="text-3xl md:text-4xl lg:text-4xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
          </div>

          <div className="relative flex-none">
            {/* Menu Icon */}
            <div className="text-2xl cursor-pointer" onClick={handleIconClick}>
              <CiMenuBurger />
            </div>

            {/* Dropdown Menu */}
            {showPopup && (
              <div className="absolute right-0 top-12 bg-white shadow-lg rounded-xl p-4 w-56 z-50">
                {/* If user logged in (email + logout) */}
                {user ? (
                  <div className="border-b pb-3 mb-3 text-center">
                    <p className="text-sm break-all">{user.email}</p>

                    {isAdmin && (
                      <button
                        onClick={() => navigate("/admin")}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-xl text-sm"
                      >
                        Admin Panel
                      </button>
                    )}

                    <button
                      onClick={logout}
                      className="mt-2 w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-xl text-sm"
                    >
                      <FiLogOut className="text-lg" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="border-b pb-3 mb-3 text-center">
                    <button
                      onClick={() => navigate("/signup")}
                      className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-xl text-sm"
                    >
                      <FiUserPlus className="text-lg" />
                      Sign Up
                    </button>

                    <button
                      onClick={() => navigate("/login")}
                      className="mt-2 w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-xl text-sm"
                    >
                      <FiLogIn className="text-lg" />
                      Login
                    </button>
                  </div>
                )}

                {/* MENU ITEMS */}
                <button
                  onClick={() => navigate("/")}
                  className="w-full flex items-center gap-2 py-2 px-2 rounded-lg text-[15px] hover:bg-gray-100"
                >
                  <AiOutlineHome className="text-xl" />
                  Home
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="w-full flex items-center gap-2 py-2 px-2 rounded-lg text-[15px] hover:bg-gray-100"
                >
                  <HiOutlineShoppingBag className="text-xl" />
                  Products
                </button>

                <button
                  onClick={() => navigate("/orders")}
                  className="w-full flex items-center gap-2 py-2 px-2 rounded-lg text-[15px] hover:bg-gray-100"
                >
                  <HiOutlineClipboardList className="text-xl" />
                  Orders
                </button>

                <button
                  onClick={() => navigate("/about")}
                  className="w-full flex items-center gap-2 py-2 px-2 rounded-lg text-[15px] hover:bg-gray-100"
                >
                  <IoInformationCircleOutline className="text-xl" />
                  About
                </button>

                <button
                  onClick={() => navigate("/contact")}
                  className="w-full flex items-center gap-2 py-2 px-2 rounded-lg text-[15px] hover:bg-gray-100"
                >
                  <RiCustomerService2Line className="text-xl" />
                  Contact
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
