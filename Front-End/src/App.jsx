import './App.css';
import { useState, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import About from './Pages/About';
import CreatePost from './Pages/CreatePost';
import Comment from './Pages/Comment';
import LikedPostSection from './Pages/LikedPostSection';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (                       
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About/>}/>
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/createNewBlog' element={<CreatePost />} />
        <Route path='/addComment' element={<Comment/>}/>
        <Route path='/likedPost' element={<LikedPostSection/>}></Route>
      </Routes>
  );
}

export default App;
