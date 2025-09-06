import React, { useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";

function Navbar() {

  const { userData } = useSelector(state => state.user);

  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showHemOptions, setShowHemOptions] = useState(false);

  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      console.log(res)
      dispatch(setUserData(null))
      toast.success(res.data.message)
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const navigate = useNavigate()
  const handleLogin = () => {
    navigate('/login')
  }
  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto sm:h-6"
          />
        </div>

        {/* Right Section (Profile Image, Dashboard, Logout) */}
        <div className="lg:flex items-center space-x-4 hidden">
          {/* Profile Image */}

          {userData && <div onClick={() => setShowProfileOptions(prev => !prev)} className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={`${userData?.imageUrl ? `${userData.imageUrl}` : '/src/assets/profile-icon.png'}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>}
          {showProfileOptions && <div className="absolute top-[10%] left-[75%] flex flex-items-center flex-col justify-center gap-2 text-[16px] rounded-md bg-[#a18bb6] px-[15px] py-[10px] border-[2px] border-[#4c0460] hover:border-[#a18bb6] hover:text-cursor-pointer hover:bg-[#4c0460]">
            <button onClick={()=>navigate('/profile')} className='hover:cursor-pointer rounded-sm px-2 py-1 hover:bg-gray-500'>My Profile</button><hr />
            <button className='hover:cursor-pointer rounded-sm px-2 py-1 hover:bg-gray-500'>My Courses</button>
          </div>}

          {/* Dashboard Button */}
          {userData?.role === "educator" ? <button className="px-4 py-2 border border-white rounded-md hover:bg-gray-700 transition sm:px-2 sm:py-1">
            Dashboard
          </button> : <></>}

          {/* Logout Button */}
          {userData ? <button
            className="px-4 py-2 border border-white rounded-md hover:bg-red-800 transition sm:px-2 sm:py-1"
            onClick={handleLogout}
          >
            Logout
          </button>
            :
            <button
              className="px-4 py-2 border border-white rounded-md hover:bg-green-300 transition sm:px-2 sm:py-1"
              onClick={handleLogin}
            >
              Login
            </button>}
        </div>

        <GiHamburgerMenu className='w-[30px] h-[30px] lg:hidden fill-white cursor-pointer' onClick={() => setShowHemOptions(prev => !prev)} />
      </nav>

      <div className={`fixed top-0 w-[100%] h-[100vh] bg-[#9372b2f9] flex items-center justify-center flex-col gap-5 z-10 lg:hidden ${showHemOptions ? 'translate-x-[0] transition duration-600' : 'translate-x-[-100%] transition duration-600'}`}>
        <RxCross1 className='w-[30px] h-[30px] lg:hidden fill-white cursor-pointer absolute top-5 right-[4%] bg-[white]' onClick={() => setShowHemOptions(prev => !prev)} />

        {/* profile image option */}
        {userData && (
          <div className="flex items-center justify-center flex-col gap-3 ">
            {/* Profile Image */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm">
              <img
                src={userData?.imageUrl || '/src/assets/profile-icon.png'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Button */}
            <button onClick={()=>navigate('/profile')} className="px-4 py-2 w-[250px] h-[40px] cursor-pointer text-white hover:bg-fuchsia-950  sm:px-2 sm:py-1">
              Profile
            </button>

             {/* dashboard for educators */}
            {userData?.role === "educator" ? <button className="px-4 py-2  w-[250px] h-[40px] cursor-pointer text-white hover:bg-fuchsia-950 sm:px-2 sm:py-1">
              Dashboard
            </button> : <></>}

            {/* My courses Button */}
            <button className="px-4 py-2 w-[250px] h-[40px] cursor-pointer text-white hover:bg-fuchsia-950  sm:px-2 sm:py-1">
              My courses
            </button>
            
            {/* logout button */}
            <button className="px-4 py-2 w-[250px] h-[40px] cursor-pointer text-white hover:bg-fuchsia-950  sm:px-2 sm:py-1" onClick={handleLogout}>
              Logout
            </button>

          </div>
        )}

        {/* if no user is logged in */}
        {!userData && (
          <div className="flex items-center justify-center flex-col gap-3 ">
            

            {/* Login Button */}
            <button className="px-4 py-2 w-[250px] h-[40px] cursor-pointer text-white hover:bg-fuchsia-950  sm:px-2 sm:py-1" onClick={()=>navigate('/login')}>
              Login
            </button>

            {/* sign up Button */}
            <button className="px-4 py-2 w-[250px] h-[40px] cursor-pointer text-white hover:bg-fuchsia-950  sm:px-2 sm:py-1" onClick={()=>navigate('/signup')}>
              Sign Up
            </button>

            
          </div>
        )}

      </div>

    </>
  );
}

export default Navbar