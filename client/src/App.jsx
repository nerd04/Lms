import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'


export const serverUrl = "http://localhost:3000"

function App() {

  getCurrentUser();

  const userData = useSelector(state=>state.user)

  return (
    <>
    <ToastContainer/>

    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/profile' element={userData ? <Profile/> : <Navigate to="/signup" /> }/>
    </Routes>
    </>
  )
}

export default App
