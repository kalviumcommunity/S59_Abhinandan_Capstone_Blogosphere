import {Link} from 'react-router-dom' 
import '../Css/Navbar.css'
import logo from '../assets/logo.png'

function Navbar() {
  return (
    <div>
        <div className='navbar'>
            <img src={logo} className="logo" alt="Blogosphere Logo" />
            <div className='navRight'>
                <div className='navBTNS'>
                    <span>Home</span>
                    <span>About</span>
                </div>
                <div className='up-inBtns'> 
                    <Link to={"/signup"}><button className='sup'>Sign Up</button></Link>
                    <Link to={"/signin"}><button className='sin'>Sign In</button></Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar