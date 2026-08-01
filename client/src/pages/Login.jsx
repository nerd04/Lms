import React, { useState, useRef } from "react";
import logo from "/logo.png";
import google from "../assets/google.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { motion } from "framer-motion";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = useRef();
  const password = useRef();

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailVal = email.current.value;
    const passwordVal = password.current.value;

    if (!emailVal) return toast.error("Enter your email");
    if (!passwordVal) return toast.error("Enter your password");

    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email: emailVal, password: passwordVal },
        { withCredentials: true }
      );
      dispatch(setUserData(res.data));
      toast.success("Welcome back! 🌱");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      const response = await axios.post(
        `${serverUrl}/api/auth/googleauth`,
        { email: user.email, name: user.displayName },
        { withCredentials: true }
      );
      dispatch(setUserData(response.data));
      toast.success("Welcome to GrowTogether! 🌸");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google Sign-in failed");
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-[#faf9f5]">
      {/* Soft gradient orbs */}
      <div className="absolute w-96 h-96 bg-indigo-200/20 blur-3xl rounded-full -top-32 -left-32 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-amber-200/20 blur-3xl rounded-full bottom-0 right-0 animate-pulse"></div>

      {/* Form Container */}
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-[90%] md:w-[850px] bg-white border border-[#e8e6df] rounded-3xl shadow-lg flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left Section - Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 text-zinc-800">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-zinc-850 tracking-tight">
              Grow Together
            </h1>
            <p className="text-sm text-zinc-500 font-semibold mt-2">
              Welcome back! Log in to continue your journey 🌿
            </p>
          </div>

          {/* Email */}
          <div className="w-full max-w-sm mb-4">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Email</label>
            <input
              ref={email}
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1.5 bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-sm"
            />
          </div>

          {/* Password */}
          <div className="w-full max-w-sm mb-4 relative">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Password</label>
            <input
              ref={password}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full mt-1.5 bg-white border border-zinc-200 rounded-xl px-4 py-3 pr-10 text-zinc-800 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-3 text-zinc-400 hover:text-indigo-600 focus:outline-none"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full max-w-sm mt-4 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Login"}
          </button>

          {/* Links */}
          <div className="text-sm mt-3">
            <span
              onClick={() => navigate("/forget-password")}
              className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
            >
              Forgot your password?
            </span>
          </div>

          {/* Divider */}
          <div className="w-full max-w-sm flex items-center gap-2 my-6">
            <div className="flex-1 h-px bg-zinc-150"></div>
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">or continue</span>
            <div className="flex-1 h-px bg-zinc-150"></div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={googleLogin}
            className="w-full max-w-sm flex items-center justify-center gap-3 py-3 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-xl text-zinc-700 font-bold text-sm shadow-sm transition cursor-pointer"
          >
            <img src={google} alt="Google" className="w-5" />
            <span>Sign in with Google</span>
          </button>

          {/* Signup */}
          <p className="text-zinc-500 font-semibold mt-6 text-sm">
            New to GrowTogether?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-indigo-650 font-extrabold underline cursor-pointer hover:text-indigo-750"
            >
              Create an account
            </span>
          </p>
        </div>

        {/* Right Section - Branding */}
        <div className="hidden md:flex flex-1 bg-zinc-50 border-l border-zinc-100 flex-col items-center justify-center text-center text-zinc-800 relative p-8">
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/10 to-transparent"></div>
          <motion.img
            src={logo}
            alt="GrowTogether Logo"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-28 mb-4 rounded-full border border-zinc-200 shadow-md"
          />
          <h2 className="text-2xl font-extrabold text-zinc-800 tracking-tight">
            Grow Together
          </h2>
          <p className="text-zinc-500 font-medium mt-2 text-sm px-6 leading-relaxed">
            “Grow through shared experiences, learn from each other, and bloom together.” 🌸
          </p>
        </div>
      </motion.form>
    </div>
  );
}

export default Login;
