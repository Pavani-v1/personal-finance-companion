import React, { useState } from 'react';
import './home.css'; // Create this CSS file for custom styles
import Login from '../auth/Login';
import video from '../../img/video.mp4'
const Homepage = () => { 
  const [showLogin, setShowLogin]=useState(false)
  return (
  <div className="homepage-container">
{
  showLogin? <Login/>:<div className="homepage-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-title">SpendSmart</h1>
        <div className="navbar-right">
          <button onClick={()=>setShowLogin(!showLogin)}   className="login-button">Login</button>
        </div>
      </nav>

      {/* Homepage Image */}
      <div className="">
      <video autoPlay muted loop id="myVideo" className='' style={{
      // position: 'fixed',
      // marginTop:"80px",
      right: 0,
      bottom: 0,
      minWidth: '100%',
      minHeight: '100%',
      width: 'auto',
      height: 'auto',
      // zIndex: -1000,
      backgroundSize: 'cover',
      opacity:"0.7"
    }}>
      <source src={video} type="video/mp4" />
    </video>
    
        {/* <img src="/homepage.png" className="homepage-image" alt="Homepage"  /> */}
      </div>
<div className='my-text'>
    <h2 className='title-text'> SpendSmart </h2>
  <h4 className='subtitle-text'> Your Personal Financial Companion </h4>
    </div>
      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Expense Tracker. All rights reserved.</p>
      </footer>
    </div>
}
 
     </div>
  );
};

export default Homepage;
