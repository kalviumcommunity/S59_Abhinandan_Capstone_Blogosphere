import {NavLink} from 'react-router-dom' 
import '../Css/Navbar.css'
import logo from '../assets/logo.png'

function Navbar() {
    
  return (
    <div>
        <div className='navbar'>
            <img src={logo} className="logo" alt="Blogosphere Logo" />
            <div className='navRight'>
                <div className='navBTNS'>
                    <NavLink to={'/'}><span>Home</span></NavLink>
                    <span>About</span>
                </div>
                <div className='up-inBtns'> 
                    <NavLink to={"/signup"}><button className='sup'>Sign Up</button></NavLink>
                    <NavLink to={"/signin"}><button className='sin'>Sign In</button></NavLink>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar