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
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950">
      {/* Animated gradient orbs */}
      <div className="absolute w-96 h-96 bg-purple-600/30 blur-3xl rounded-full -top-32 -left-32 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-500/30 blur-3xl rounded-full bottom-0 right-0 animate-pulse"></div>

      {/* Glass Container */}
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-[90%] md:w-[850px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left Section - Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 text-white">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
              Grow Together
            </h1>
            <p className="text-sm text-gray-300 mt-2">
              Welcome back! Log in to continue your journey 🌿
            </p>
          </div>

          {/* Email */}
          <div className="w-full max-w-sm mb-4">
            <label className="text-sm text-purple-200 ml-2">Email</label>
            <input
              ref={email}
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 bg-white/5 border border-purple-400/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
            />
          </div>

          {/* Password */}
          <div className="w-full max-w-sm mb-4 relative">
            <label className="text-sm text-purple-200 ml-2">Password</label>
            <input
              ref={password}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full mt-1 bg-white/5 border border-purple-400/20 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-3 text-gray-400 hover:text-purple-300"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full max-w-sm mt-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white shadow-lg hover:scale-[1.02] transition-transform"
          >
            {loading ? <ClipLoader size={24} color="#fff" /> : "Login"}
          </button>

          {/* Links */}
          <div className="text-sm text-gray-300 mt-3">
            <span
              onClick={() => navigate("/forget-password")}
              className="cursor-pointer text-purple-300 hover:underline"
            >
              Forgot your password?
            </span>
          </div>

          {/* Divider */}
          <div className="w-full max-w-sm flex items-center gap-2 my-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-xs text-gray-400">or continue</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={googleLogin}
            className="w-full max-w-sm flex items-center justify-center gap-3 py-2.5 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition"
          >
            <img src={google} alt="Google" className="w-5" />
            <span className="text-white text-sm font-medium">Sign in with oogle</span>
          </button>

          {/* Signup */}
          <p className="text-gray-400 mt-6 text-sm">
            New to GrowTogether?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-purple-300 underline cursor-pointer hover:text-purple-200"
            >
              Create an account
            </span>
          </p>
        </div>

        {/* Right Section - Branding */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-purple-700/40 to-blue-800/40 backdrop-blur-xl flex-col items-center justify-center text-center text-white relative">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
          <motion.img
            src={logo}
            alt="GrowTogether Logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-32 mb-4 drop-shadow-lg"
          />
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
            Grow Together
          </h2>
          <p className="text-gray-300 mt-2 text-sm px-6">
            “Grow through shared experiences, learn from each other, and bloom together.” 🌸
          </p>
        </div>
      </motion.form>
    </div>
  );
}

export default Login;
