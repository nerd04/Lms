import React, { useState, useRef } from 'react'
import logo from "/logo.png";
import google from "../assets/google.png";
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { ClipLoader } from 'react-spinners';
import { serverUrl } from '../App';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const email = useRef();
  const password = useRef();

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailVal = email.current.value;
    const passwordVal = password.current.value;


    if (!emailVal) return toast.error("enter your email Id")
    if (!passwordVal) return toast.error("enter ypur password")
    setLoading(true)
    try {
      const res = await axios.post(`${serverUrl}/api/auth/login`, {
        email: emailVal,
        password: passwordVal,
      }, { withCredentials: true })
      console.log(res.data);
      dispatch(setUserData(res.data))
      setLoading(false)
      navigate("/")
      toast.success("Login successfull")
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.response.data.message)
    }
  }



  return (
    <div className="bg-[#dddbdb] w-screen h-screen flex items-center justify-center">
      {/* Form Container */}
      <form onSubmit={handleLogin} className="w-[90%] md:w-[800px] h-[600px] bg-white shadow-xl rounded-2xl flex overflow-hidden">
        {/* Left Section */}
        <div className="md:w-1/2 w-full h-full flex flex-col items-center justify-center gap-5 px-8 py-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="font-bold text-[#4c0460] text-3xl">Let's get started</h1>
            <h2 className="text-[#a18bb6] text-lg">Login to your Account</h2>
          </div>

          {/* Email */}
          <div className="w-full">
            <input
              id="email"
              type="email"
              ref={email}
              autoComplete="current-password"
              placeholder="Your email"
              className="w-full border border-[#a18bb6] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4c0460]"
            />
          </div>

          {/* Password with Toggle */}
          <div className="w-full relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              ref={password}
              placeholder="Enter password"
              className="w-full border border-[#a18bb6] rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#4c0460]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-[#4c0460] focus:outline-none"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Login Button */}
          <button type='submit' className="w-full py-3 bg-[#4c0460] text-white font-semibold rounded-lg hover:bg-[#350142] transition">

            {loading ? <ClipLoader size={25} color="purple" /> : "Login"}
          </button>

          {/* Reset Password */}
          <span className='text-[13px] cursor-pointer text-[#a18bb6] '>Forget your Password ?</span>

          {/* Divider */}
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 h-px bg-[#a18bb6]"></div>
            <span className="text-sm text-[#4c0460]">Or continue</span>
            <div className="flex-1 h-px bg-[#a18bb6]"></div>
          </div>

          {/* Google Button */}
          <button className="w-full flex items-center justify-center gap-2 border border-[#a18bb6] py-2 rounded-lg hover:bg-gray-100 transition">
            <img src={google} className="w-5" alt="Google" />
            <span className="text-[#4c0460] font-medium">Sign In with Google</span>
          </button>


          <div className="text-[#a18bb6]">Create a new Account ? <span onClick={() => navigate('/signup')} className="underline underline-offset-1 text-[#4c0460] cursor-pointer">Sign Up</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex w-1/2 h-full bg-[#4c0460] items-center justify-center flex-col gap-3">
          <img src={logo} className="w-32 shadow-2xl rounded-xl" alt="logo" />
          <p className="text-white text-xl font-semibold">We Learn</p>
        </div>
      </form>
    </div>
  )
}

export default Login