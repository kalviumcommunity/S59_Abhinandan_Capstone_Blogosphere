import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import CreatePost from './Pages/CreatePost'

function App() {

  return (                       
    <>
      <Routes>
        <Route path = '/' element={<Home/>}/>
        <Route path = '/signin' element={<SignIn/>}/>
        <Route path = '/signup' element={<SignUp/>}/>
        <Route path = '/createNewBlog' element={<CreatePost/>}/>
      </Routes>
    </>
  )
}

export default App
