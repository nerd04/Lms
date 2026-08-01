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
      {/* 🌌 Frosted Light-Medium Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-[#e8e6df] shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* 🌱 Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.png"
              alt="GrowTogether Logo"
              className="h-10 w-10 object-contain rounded-full border border-zinc-200 shadow-sm transition-transform group-hover:rotate-6"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 via-zinc-800 to-indigo-950 bg-clip-text text-transparent hidden sm:block tracking-tight">
              GrowTogether
            </span>
          </div>

          {/* 💻 Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => navigate("/courses")}
              className="text-zinc-600 hover:text-indigo-600 transition-colors font-medium text-sm cursor-pointer"
            >
              Explore Courses
            </button>
            {userData ? (
              <>
                {userData.role === "educator" && (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-5 py-2.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition shadow-sm text-sm cursor-pointer"
                  >
                    Dashboard
                  </button>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <div
                    onClick={() => setShowProfileOptions((prev) => !prev)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100 cursor-pointer hover:border-indigo-400 hover:scale-[1.02] active:scale-[0.98] transition"
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
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-48 bg-white text-zinc-700 rounded-2xl shadow-xl border border-zinc-150 backdrop-blur-md overflow-hidden"
                      >
                        <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-100">
                          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Signed in as</p>
                          <p className="text-sm font-bold text-zinc-800 truncate">{userData.name}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setShowProfileOptions(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-50 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            navigate("/my-courses");
                            setShowProfileOptions(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-50 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          My Courses
                        </button>
                        <hr className="border-zinc-100" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors font-medium cursor-pointer"
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
                  className="px-5 py-2.5 rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold text-sm transition-all cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer text-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* 🍔 Mobile Hamburger */}
          <div className="lg:hidden">
            <GiHamburgerMenu
              className="w-6 h-6 cursor-pointer text-zinc-700 hover:text-indigo-600 transition"
              onClick={() => setShowMenu(true)}
            />
          </div>
        </div>
      </nav>

      {/* 📱 Mobile Menu (Animated Light-Medium) */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 22 }}
            className="fixed top-0 left-0 w-full h-full bg-white/98 flex flex-col items-center justify-center gap-6 text-zinc-800 z-[999] backdrop-blur-xl"
          >
            {/* ❌ Close Button */}
            <button
              onClick={() => setShowMenu(false)}
              className="absolute top-5 right-5 p-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <RxCross1 className="w-5 h-5" />
            </button>

            {/* 🌈 Menu Content */}
            <button
              onClick={() => {
                navigate("/courses");
                setShowMenu(false);
              }}
              className="text-lg font-semibold text-zinc-700 hover:text-indigo-600 transition-colors"
            >
              Explore Courses
            </button>
            
            {userData ? (
              <>
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md">
                  <img
                    src={userData.imageUrl || "/src/assets/profile-icon.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg font-bold text-zinc-800 -mt-2">{userData.name}</p>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}
                  className="w-64 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold shadow-sm transition"
                >
                  My Profile
                </motion.button>

                {userData.role === "educator" && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate("/dashboard");
                      setShowMenu(false);
                    }}
                    className="w-64 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition"
                  >
                    Dashboard
                  </motion.button>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate("/my-courses");
                    setShowMenu(false);
                  }}
                  className="w-64 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold shadow-sm transition"
                >
                  My Courses
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}
                  className="w-64 py-3 rounded-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold shadow-sm transition"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate("/login");
                    setShowMenu(false);
                  }}
                  className="w-64 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold shadow-sm transition"
                >
                  Login
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate("/signup");
                    setShowMenu(false);
                  }}
                  className="w-64 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition"
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

