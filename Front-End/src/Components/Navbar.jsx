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
                    <button className='sup'>Sign Up</button>
                    <button className='sin'>Sign In</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar