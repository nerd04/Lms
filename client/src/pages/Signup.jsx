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
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950">
      {/* Animated gradient blobs */}
      <div className="absolute w-80 h-80 bg-purple-600/30 blur-3xl rounded-full -top-24 -left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-500/30 blur-3xl rounded-full bottom-0 right-0 animate-pulse"></div>

      <motion.form
        onSubmit={handleSignUp}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-[90%] sm:w-[450px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white flex flex-col gap-5"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent text-center">
          Create Your Account
        </h2>

        <input
          ref={name}
          type="text"
          placeholder="Your Name"
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        <input
          ref={email}
          type="email"
          placeholder="Your Email"
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        <div className="relative">
          <input
            ref={password}
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-300 hover:text-white focus:outline-none"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Role Selection */}
        <div className="flex gap-4 justify-center mt-2">
          <span
            onClick={() => setRole("student")}
            className={`px-5 py-2 border-2 rounded-xl cursor-pointer ${
              role === "student"
                ? "border-white bg-white/20"
                : "border-white/50 hover:border-white"
            }`}
          >
            Student
          </span>
          <span
            onClick={() => setRole("educator")}
            className={`px-5 py-2 border-2 rounded-xl cursor-pointer ${
              role === "educator"
                ? "border-white bg-white/20"
                : "border-white/50 hover:border-white"
            }`}
          >
            Educator
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:scale-[1.02] transition-transform"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {/* Google SignUp */}
        <button
          type="button"
          onClick={googleSignUp}
          className="w-full flex items-center justify-center gap-2 border border-white/30 py-2 rounded-xl hover:bg-white/10 transition mt-2"
        >
          <img src={google} className="w-5" alt="Google" />
          <span className="text-white font-medium">Sign Up with Google</span>
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-center text-purple-300 hover:underline cursor-pointer mt-3"
        >
          Already have an account? Login
        </p>
      </motion.form>
    </div>
  );
}

export default Signup;
