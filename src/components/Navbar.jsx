import React from 'react'
import { IoPersonOutline } from 'react-icons/io5'

export default function Navbar() {
    const link = (
        <>
        <li>Home</li>
        <li>Product</li>
        <li>About</li>
        <li>Contact</li>
        </>
    )
  return (
    <div className="navbar shadow-md #faf6f1 backdrop-blur-md text-[#202020] fixed top-0 left-0 right-0 z-100 font-mon">
 <div className='w-11/12 mx-auto flex justify-between items-center'>
     <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-#faf6f1 backdrop-blur-md rounded-box z-1 mt-3 w-52 p-2 shadow">
        {link}
      </ul>
    </div>
    <div className='flex items-center gap-10'>
        <a className="lg:text-3xl sm:text-2xl font-pop">TRENDZONE</a>
        <div className="navbar-center hidden lg:flex">
    <ul className="flex gap-6">
      {link}
    </ul>
  </div>
    </div>
  </div>
  <div className="navbar-end flex gap-6">
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
  <input type="search" required placeholder="Search" className='bg-transparent outline-none text-sm text-[#202020] placeholder-[#202020] w-10 md:w-40  sm:flex'/>
</label>
<div className="avatar">
  <div className="text-3xl">
   <IoPersonOutline />
  </div>
</div>
  </div>
 </div>
</div>
  )
}
