import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      {/* 🌌 Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-gradient-to-r from-gray-900/80 via-gray-800/60 to-gray-900/80 border-b border-gray-700/40 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* 🌱 Brand */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.png"
              alt="GrowTogether Logo"
              className="h-10 w-10 object-contain rounded-full border border-purple-400/30 shadow-sm"
            />
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:block">
              GrowTogether
            </span>
          </div>

          {/* 💻 Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {userData ? (
              <>
                {userData.role === "educator" && (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-700 to-blue-700 text-white hover:scale-105 transition-transform shadow-md"
                  >
                    Dashboard
                  </button>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <div
                    onClick={() => setShowProfileOptions((prev) => !prev)}
                    className="w-11 h-11 rounded-full overflow-hidden border-2 border-purple-400/60 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img
                      src={userData.imageUrl || "/src/assets/profile-icon.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <AnimatePresence>
                    {showProfileOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="absolute right-0 mt-3 w-48 bg-gray-900/90 text-gray-100 rounded-xl shadow-lg border border-gray-700/40 backdrop-blur-lg overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setShowProfileOptions(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-purple-700/30"
                        >
                          My Profile
                        </button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-purple-700/30">
                          My Courses
                        </button>
                        <hr className="border-gray-700/50" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-red-600/30 text-red-400"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 rounded-full border border-purple-400/40 text-gray-100 hover:bg-purple-700/30 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-full shadow-md hover:shadow-purple-600/40 hover:scale-105 transition-transform"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* 🍔 Mobile Hamburger */}
          <div className="lg:hidden">
            <GiHamburgerMenu
              className="w-7 h-7 cursor-pointer text-purple-300 hover:text-white transition"
              onClick={() => setShowMenu(true)}
            />
          </div>
        </div>
      </nav>

      {/* 📱 Mobile Menu (Animated) */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
            className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center gap-6 text-white z-[999] backdrop-blur-xl"
          >
            {/* ❌ Close Button */}
            <button
              onClick={() => setShowMenu(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              aria-label="Close menu"
            >
              <RxCross1 className="w-6 h-6" />
            </button>

            {/* 🌈 Menu Content */}
            {userData ? (
              <>
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-400 shadow-xl">
                  <img
                    src={userData.imageUrl || "/src/assets/profile-icon.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}
                  className="w-64 py-3 rounded-full bg-gradient-to-r from-purple-700 to-blue-700 text-white shadow-md"
                >
                  My Profile
                </motion.button>

                {userData.role === "educator" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      navigate("/dashboard");
                      setShowMenu(false);
                    }}
                    className="w-64 py-3 rounded-full bg-gradient-to-r from-purple-700 to-blue-700 text-white shadow-md"
                  >
                    Dashboard
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="w-64 py-3 rounded-full bg-gradient-to-r from-purple-700 to-blue-700 text-white shadow-md"
                >
                  My Courses
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleLogout}
                  className="w-64 py-3 rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-md"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    navigate("/login");
                    setShowMenu(false);
                  }}
                  className="w-64 py-3 rounded-full bg-gradient-to-r from-purple-700 to-blue-700 text-white shadow-md"
                >
                  Login
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    navigate("/signup");
                    setShowMenu(false);
                  }}
                  className="w-64 py-3 rounded-full bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-md"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
