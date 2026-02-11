import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  FaWandMagicSparkles,
  FaUserGraduate,
  FaLaptopCode,
} from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { BsBuildingCheck } from "react-icons/bs";

function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-6">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl opacity-50 animate-pulse"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl text-center mt-40"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            Welcome to WeLearn
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Your personalized learning platform — explore expert-led courses,
            gain real-world skills, and take your knowledge to the next level.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-600/40 transition-all"
            >
              
              <span>Search with AI</span>
              <FaWandMagicSparkles className="text-lg" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-600/40 transition-all"
            >
              <span>Browse Courses</span>
              <IoSearch className="text-xl" />
            </motion.button>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative mt-20 w-full max-w-5xl"
        >
          <img
            src="/src/assets/welearn-hero.png"
            alt="WeLearn Online Courses"
            className="rounded-3xl shadow-2xl border border-gray-800 hover:scale-105 transition-transform duration-500 mb-20"
          />
        </motion.div>
      </section>

      {/* 🌟 Why Learners Love WeLearn Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 relative overflow-hidden">
        {/* Gradient Background Orbs */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-purple-700/30 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl opacity-40"></div>

        <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-12">
            Why Learners <span className="text-pink-400">Love WeLearn</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {/* Stat 1 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:bg-gray-800/60 transition-all border border-gray-800"
            >
              <FaLaptopCode className="text-4xl text-blue-400 mb-3" />
              <h3 className="text-2xl font-semibold text-white">500+</h3>
              <p className="text-gray-400 mt-1">Expert-Led Courses</p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:bg-gray-800/60 transition-all border border-gray-800"
            >
              <MdGroups className="text-4xl text-purple-400 mb-3" />
              <h3 className="text-2xl font-semibold text-white">20K+</h3>
              <p className="text-gray-400 mt-1">Active Learners</p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:bg-gray-800/60 transition-all border border-gray-800"
            >
              <BsBuildingCheck className="text-4xl text-blue-300 mb-3" />
              <h3 className="text-2xl font-semibold text-white">1.5K+</h3>
              <p className="text-gray-400 mt-1">Mentorship Sessions</p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:bg-gray-800/60 transition-all border border-gray-800"
            >
              <FaUserGraduate className="text-4xl text-pink-400 mb-3" />
              <h3 className="text-2xl font-semibold text-white">98%</h3>
              <p className="text-gray-400 mt-1">Learner Satisfaction</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-800 bg-gray-950">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-purple-400">WeLearn</span> — Empowering
        continuous learning and skill growth for everyone.
      </footer>
    </>
  );
}

export default Home;
