import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { serverUrl } from "../App";
import { motion } from "framer-motion";

function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const otp = useRef();
  const password1 = useRef();
  const password2 = useRef();
  const navigate = useNavigate();

  // Step 1
  const handleStepOne = async () => {
    const eformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!eformat.test(email)) return toast.error("Invalid email address");
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/sendotp`,
        { email },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // Step 2
  const handleStepTwo = async () => {
    const otpVal = otp.current.value;
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/verifyotp`,
        { email, otp: otpVal },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setStep(3);
    } catch (error) {
      toast.error("Error verifying OTP");
    }
  };

  // Step 3
  const handleStepThree = async () => {
    const pass1 = password1.current.value;
    const pass2 = password2.current.value;
    if (pass1 !== pass2) return toast.error("Passwords do not match!");
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/resetpassword`,
        { email, password: pass1 },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950">
      {/* Animated gradient blobs */}
      <div className="absolute w-80 h-80 bg-purple-600/30 blur-3xl rounded-full -top-24 -left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-500/30 blur-3xl rounded-full bottom-0 right-0 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-[90%] sm:w-[450px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 text-white"
      >
        {/* Step 1 */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent text-center">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-300 text-center">
              Don’t worry! Enter your registered email and we’ll send you a code
              to reset it 🌸
            </p>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            <button
              onClick={handleStepOne}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:scale-[1.02] transition-transform"
            >
              Send OTP
            </button>
            <p
              onClick={() => navigate("/login")}
              className="text-center text-purple-300 hover:underline cursor-pointer text-sm"
            >
              ← Back to Login
            </p>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 text-center"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Verify OTP
            </h2>
            <p className="text-sm text-gray-300">
              Enter the 4-digit code we sent to <br />
              <span className="text-purple-300 font-semibold">{email}</span>
            </p>
            <input
              ref={otp}
              maxLength={4}
              type="text"
              placeholder="••••"
              className="w-full text-center tracking-widest text-lg bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            <button
              onClick={handleStepTwo}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:scale-[1.02] transition-transform"
            >
              Verify
            </button>
            <div className="flex justify-between text-sm text-purple-300">
              <span
                onClick={() => setStep(1)}
                className="cursor-pointer hover:underline"
              >
                ← Back
              </span>
              <span
                onClick={() => navigate("/login")}
                className="cursor-pointer hover:underline"
              >
                Back to Login
              </span>
            </div>
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent text-center">
              Reset Password
            </h2>
            <div>
              <label className="text-sm text-purple-200">New Password</label>
              <input
                ref={password1}
                type="password"
                placeholder="Enter new password"
                className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-purple-200">Confirm Password</label>
              <input
                ref={password2}
                type="password"
                placeholder="Confirm new password"
                className="w-full mt-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <button
              onClick={handleStepThree}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:scale-[1.02] transition-transform"
            >
              Reset Password
            </button>
            <p
              onClick={() => navigate("/login")}
              className="text-center text-purple-300 hover:underline cursor-pointer text-sm"
            >
              ← Back to Login
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default ForgetPassword;
