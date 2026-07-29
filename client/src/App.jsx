import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgetPassword from './pages/ForgetPassword'
import BrowseCourses from './pages/BrowseCourses'
import CourseDetails from './pages/CourseDetails'
import Dashboard from './pages/Dashboard'
import MyCourses from './pages/MyCourses'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'

export const serverUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3000"
  : (import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL || "http://localhost:3000");

function App() {
  getCurrentUser();

  // Fix: Destructure userData from state.user to prevent the wrapper object from bypassing route guards
  const { userData } = useSelector(state => state.user);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
        
        {/* Protected Profile Route */}
        <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/login" />} />
        
        {/* Course Catalog & Details */}
        <Route path='/courses' element={<BrowseCourses />} />
        <Route path='/courses/:id' element={<CourseDetails />} />
        <Route path='/my-courses' element={userData ? <MyCourses /> : <Navigate to="/login" />} />
        
        {/* Protected Educator Dashboard */}
        <Route path='/dashboard' element={
          userData && userData.role === 'educator' ? <Dashboard /> : <Navigate to="/" />
        } />
        
        {/* Catch-all Redirect */}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App;
