import { useNavigate } from "react-router-dom";
import { IoPersonOutline } from 'react-icons/io5'
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";


export default function Navbar() {

   const [user, setUser] = useState(null);
   const [showPopup, setShowPopup] = useState(false);
   const navigate = useNavigate();

    const link = (
        <>
        <li>Home</li>
        <li>Product</li>
        <li>About</li>
        <li>Contact</li>
        </>
    )

  // This keeps user logged in on refresh
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
      } else {
        setUser(user);
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleIconClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000); // hide after 5 sec
    }
  };

  const logout = async () => {
    await signOut(auth);
    setShowPopup(false);
    navigate("/");
  };

  return (
    <div className="navbar shadow-md #faf6f1 backdrop-blur-md text-[#202020] fixed top-0 left-0 right-0 z-100 font-mon">
 <div className='px-3 md:w-11/12 lg:w-11/12 mx-auto flex justify-between items-center'>
     <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow">
        {link}
      </ul>
    </div>
    <div className='flex items-center gap-10'>
        <a className="lg:text-4xl sm:text-2xl font-mon font-bold text-[#ff8f9c] hover:text-[#000000] transition">TRENDZONE</a>
        <div className="navbar-center hidden lg:flex">
    <ul className="flex gap-6">
      {link}
    </ul>
  </div>
    </div>
  </div>
  <div className="navbar-end flex gap-2 md:gap-6 lg:gap-6">
    <label className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 border border-[#D1D5DC]">
  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> 
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
  <input type="search" required placeholder="Search" className='bg-transparent outline-none text-sm text-[#202020] placeholder-[#202020] w-15 md:w-40  sm:flex'/>
</label>
<div className="relative flex-none">
     
      <div className="text-2xl md:text-3xl lg:text-3xl cursor-pointer" onClick={handleIconClick}>
        <IoPersonOutline />
      </div>

      {user && showPopup && (
        <div className="absolute right-0 top-12 bg-white shadow-lg rounded-xl p-3 w-52 text-center z-50">
          <p className="text-sm break-all">{user.email}</p>
          <button
            onClick={logout}
            className="mt-3 w-full bg-[#ff8f9c] text-white py-1.5 rounded-xl hover:bg-black transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
 </div>
</div>
  )
}
