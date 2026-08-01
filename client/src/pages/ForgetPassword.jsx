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
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-[#faf9f5]">
      {/* Soft gradient blobs */}
      <div className="absolute w-80 h-80 bg-indigo-200/20 blur-3xl rounded-full -top-24 -left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-amber-200/20 blur-3xl rounded-full bottom-0 right-0 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-[90%] sm:w-[450px] bg-white border border-[#e8e6df] rounded-3xl shadow-lg p-8 text-zinc-800 flex flex-col gap-5 animate-none"
      >
        {/* Step 1 */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-extrabold text-zinc-850 tracking-tight text-center">
              Forgot Password?
            </h2>
            <p className="text-sm text-zinc-500 font-semibold text-center leading-relaxed">
              Don’t worry! Enter your registered email and we’ll send you a code to reset it 🌸
            </p>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-sm"
              required
            />
            <button
              onClick={handleStepOne}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
            >
              Send OTP
            </button>
            <p
              onClick={() => navigate("/login")}
              className="text-center text-indigo-600 hover:text-indigo-750 font-bold cursor-pointer text-sm"
            >
              ← Back to Login
            </p>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-center"
          >
            <h2 className="text-3xl font-extrabold text-zinc-850 tracking-tight text-center">
              Verify OTP
            </h2>
            <p className="text-sm text-zinc-500 font-semibold leading-relaxed">
              Enter the 4-digit code we sent to <br />
              <span className="text-indigo-600 font-extrabold">{email}</span>
            </p>
            <input
              ref={otp}
              maxLength={4}
              type="text"
              placeholder="••••"
              className="w-full text-center tracking-widest text-lg bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold"
            />
            <button
              onClick={handleStepTwo}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
            >
              Verify Code
            </button>
            <div className="flex justify-between text-sm font-bold text-indigo-600">
              <span
                onClick={() => setStep(1)}
                className="cursor-pointer hover:text-indigo-750 hover:underline"
              >
                ← Back
              </span>
              <span
                onClick={() => navigate("/login")}
                className="cursor-pointer hover:text-indigo-750 hover:underline"
              >
                Back to Login
              </span>
            </div>
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-extrabold text-zinc-850 tracking-tight text-center">
              Reset Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">New Password</label>
                <input
                  ref={password1}
                  type="password"
                  placeholder="Enter new password"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Confirm Password</label>
                <input
                  ref={password2}
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-sm"
                  required
                />
              </div>
            </div>
            <button
              onClick={handleStepThree}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
            >
              Reset Password
            </button>
            <p
              onClick={() => navigate("/login")}
              className="text-center text-indigo-600 hover:text-indigo-750 font-bold cursor-pointer text-sm"
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
