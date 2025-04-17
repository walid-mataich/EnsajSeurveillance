import React from 'react'
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Footer from '../components/Footer';


const Home = () => {
  localStorage.removeItem("jwtTokensurv");
  localStorage.removeItem("jwtTokenadmin");
  return (
    <div>
      <Navbar/>
      <Hero/>
      <About/>
      <Footer/>
    </div>
  )
}

export default Home