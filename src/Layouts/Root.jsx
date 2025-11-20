import React from 'react'
import { Outlet } from 'react-router'
import Home from "../Pages/Home"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Root = () => {
  return (
    <div>
    <Outlet></Outlet>
    <Navbar></Navbar>
    <Home></Home>
    <Footer></Footer>
    </div>
  )
}

export default Root