import './App.css';
import { useState, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import About from './Pages/About';
import CreatePost from './Pages/CreatePost';
import Comment from './Pages/Comment';

export const LoginStatusContext = createContext(null);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (                       
    <LoginStatusContext.Provider value={{ isLoggedIn, setIsLoggedIn, login: () => {} }}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About/>}/>
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/createNewBlog' element={<CreatePost />} />
        <Route path='addComment' element={<Comment/>}/>
      </Routes>
    </LoginStatusContext.Provider>
  );
}

export default App;
