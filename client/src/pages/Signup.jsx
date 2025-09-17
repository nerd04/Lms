import React, { useRef, useState } from "react";
import logo from "/logo.png";
import google from "../assets/google.png";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from 'react-spinners'
import axios from 'axios'
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const name = useRef();
  const email = useRef();
  const password = useRef();
  const [role, setRole] = useState("student")

  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const nameVal = name.current.value;
    const emailVal = email.current.value;
    const passwordVal = password.current.value;

    console.log(name.current.value)
    console.log(email.current.value)
    console.log(password.current.value)
    console.log(role)

    setLoading(true)
    try {
      const res = await axios.post(`${serverUrl}/api/auth/signup`, {
        name: nameVal,
        email: emailVal,
        password: passwordVal,
        role: role
      }, { withCredentials: true })
      console.log(res.data);
      dispatch(setUserData(res.data))
      setLoading(false)
      navigate("/")
      toast.success("Sign up successfully")
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.response.data.message)
    }

  }



  const googleSignUp = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      let user = res.user;
      let name = user.displayName;
      let email = user.email;

      const response = await axios.post(`${serverUrl}/api/auth/googleauth`,
        {
          email,
          name,
          role
        }, { withCredentials: true });

      dispatch(setUserData(response.data))
      navigate('/')
      toast.success("Signup successfull")

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    }
  }








  return (
    <div className="bg-[#dddbdb] w-screen h-screen flex items-center justify-center">
      {/* Form Container */}
      <form className="w-[90%] md:w-[800px] h-[600px] bg-white shadow-xl rounded-2xl flex overflow-hidden" onSubmit={handleSignUp}>
        {/* Left Section */}
        <div className="md:w-1/2 w-full h-full flex flex-col items-center justify-center gap-5 px-8 py-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="font-bold text-[#4c0460] text-3xl">Let's get started</h1>
            <h2 className="text-[#a18bb6] text-lg">Create Your Account</h2>
          </div>

          {/* Name */}
          <div className="w-full">
            <input
              id="name"
              type="text"
              ref={name}
              placeholder="Your name"
              className="w-full border border-[#a18bb6] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4c0460]"
            />
          </div>

          {/* Email */}
          <div className="w-full">
            <input
              id="email"
              type="email"
              ref={email}
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

          {/* Role Selection */}
          <div className="flex w-full items-center justify-between">
            <span className={`px-5 py-2 border-[2px] border-[#a18bb6] rounded-xl cursor-pointer hover:border-[#4c0460] ${role === "student" ? "border-black bg-[#c2aad7]" : "border-[#a18bb6]"}`} onClick={() => setRole("student")}>
              Student
            </span>
            <span className={`px-5 py-2 border-2 border-[#a18bb6] rounded-xl cursor-pointer hover:border-[#4c0460] ${role === "educator" ? "border-black bg-[#c2aad7]" : "border-[#a18bb6]"}`} onClick={() => setRole("educator")}>
              Educator
            </span>
          </div>

          {/* Sign Up Button */}
          <button className="w-full py-3 bg-[#4c0460] text-white font-semibold rounded-lg hover:bg-[#350142] transition " disabled={loading} type="submit">
            {loading ? <ClipLoader size={25} color="purple" /> : "Sign Up"}

          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 h-px bg-[#a18bb6]"></div>
            <span className="text-sm text-[#4c0460]">Or continue</span>
            <div className="flex-1 h-px bg-[#a18bb6]"></div>
          </div>

          {/* Google Button */}
          <span onClick={googleSignUp} className="w-full flex items-center justify-center gap-2 border border-[#a18bb6] py-2 rounded-lg hover:bg-gray-100 transition">
            <img src={google} className="w-5" alt="Google" />
            <span className="text-[#4c0460] font-medium">Sign up with Google</span>
          </span>




          <div className="text-[#a18bb6]">already have an Account ? <span onClick={() => navigate('/login')} className="underline underline-offset-1 text-[#4c0460] cursor-pointer">Login</span>
          </div>
        </div>


        {/* Right Section */}
        <div className="hidden md:flex w-1/2 h-full bg-[#4c0460] items-center justify-center flex-col gap-3">
          <img src={logo} className="w-32 shadow-2xl rounded-xl" alt="logo" />
          <p className="text-white text-xl font-semibold">We Learn</p>
        </div>


      </form>
    </div>
  );
}

export default Signup;
