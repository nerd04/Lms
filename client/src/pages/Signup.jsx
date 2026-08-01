import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import google from "../assets/google.png";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { motion } from "framer-motion";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const nameVal = name.current.value;
    const emailVal = email.current.value;
    const passwordVal = password.current.value;

    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name: nameVal, email: emailVal, password: passwordVal, role },
        { withCredentials: true }
      );
      dispatch(setUserData(res.data));
      setLoading(false);
      navigate("/");
      toast.success("Signed up successfully!");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const googleSignUp = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      const response = await axios.post(
        `${serverUrl}/api/auth/googleauth`,
        { email: user.email, name: user.displayName, role },
        { withCredentials: true }
      );
      dispatch(setUserData(response.data));
      navigate("/");
      toast.success("Signed up successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google signup failed");
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-[#faf9f5]">
      {/* Soft gradient blobs */}
      <div className="absolute w-80 h-80 bg-indigo-200/20 blur-3xl rounded-full -top-24 -left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-amber-200/20 blur-3xl rounded-full bottom-0 right-0 animate-pulse"></div>

      <motion.form
        onSubmit={handleSignUp}
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-[90%] sm:w-[450px] bg-white border border-[#e8e6df] rounded-3xl shadow-lg p-8 text-zinc-800 flex flex-col gap-5 animate-none"
      >
        <h2 className="text-3xl font-extrabold text-zinc-850 tracking-tight text-center">
          Create Your Account
        </h2>

        <div className="space-y-4">
          <input
            ref={name}
            type="text"
            placeholder="Your Name"
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-sm"
            required
          />
          <input
            ref={email}
            type="email"
            placeholder="Your Email"
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-sm"
            required
          />
          <div className="relative">
            <input
              ref={password}
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 pr-10 text-zinc-800 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-zinc-400 hover:text-indigo-650 focus:outline-none"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Role Selection */}
        <div className="flex gap-4 justify-center py-1">
          <span
            onClick={() => setRole("student")}
            className={`flex-1 text-center py-2.5 border-2 rounded-xl cursor-pointer font-bold text-sm transition-all ${
              role === "student"
                ? "border-indigo-650 bg-indigo-50 text-indigo-700 shadow-sm"
                : "border-zinc-200 text-zinc-500 hover:border-zinc-350 hover:bg-zinc-50"
            }`}
          >
            Student
          </span>
          <span
            onClick={() => setRole("educator")}
            className={`flex-1 text-center py-2.5 border-2 rounded-xl cursor-pointer font-bold text-sm transition-all ${
              role === "educator"
                ? "border-indigo-650 bg-indigo-50 text-indigo-700 shadow-sm"
                : "border-zinc-200 text-zinc-500 hover:border-zinc-350 hover:bg-zinc-50"
            }`}
          >
            Educator
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {/* Google SignUp */}
        <button
          type="button"
          onClick={googleSignUp}
          className="w-full flex items-center justify-center gap-2.5 border border-zinc-200 bg-white hover:bg-zinc-50 py-3 rounded-xl text-zinc-700 font-bold text-sm transition shadow-sm cursor-pointer"
        >
          <img src={google} className="w-5" alt="Google" />
          <span>Sign Up with Google</span>
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-center text-indigo-600 hover:text-indigo-750 underline font-bold cursor-pointer mt-2 text-sm"
        >
          Already have an account? Login
        </p>
      </motion.form>
    </div>
  );
}

export default Signup;
