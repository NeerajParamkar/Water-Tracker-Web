import {Outlet} from 'react-router-dom';
import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
function Layout(){
  return (
    <div className='bg-[#030814]'>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Layout

