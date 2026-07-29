import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaWandMagicSparkles,
  FaUserGraduate,
  FaLaptopCode,
} from "react-icons/fa6";
import {
  FaChalkboardTeacher,
  FaLightbulb,
  FaQuoteLeft,
  FaArrowRight,
} from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { BsBuildingCheck } from "react-icons/bs";

function Home() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const handleStartTeaching = () => {
    if (userData) {
      if (userData.role === "educator") {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    } else {
      navigate("/signup");
    }
  };

  return (
    <>
      <Navbar />

      {/* 🚀 Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-6">
        {/* Glowing Decorative Background Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-60 animate-pulse"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl text-center mt-36"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest inline-block mb-6 shadow-md"
          >
            The Knowledge Exchange Hub 🌐
          </motion.span>

          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight drop-shadow-xl">
            Where Creators Teach <br />& Learners Thrive
          </h1>

          <p className="mt-8 text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            WeLearn is the ultimate ecosystem built to unite passionate educators and curious minds. 
            Whether you want to build structured video courses and share your skills, or stream premium lectures and expand your knowledge, this platform is made for you.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/courses")}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full shadow-lg hover:shadow-purple-600/40 transition-all cursor-pointer"
            >
              <span>Explore Catalog</span>
              <IoSearch className="text-xl" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleStartTeaching}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-blue-600/40 transition-all cursor-pointer"
            >
              <span>Become a Creator</span>
              <FaChalkboardTeacher className="text-xl" />
            </motion.button>
          </div>
        </motion.div>

        {/* Hero Image / Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative mt-20 w-full max-w-5xl px-4"
        >
          <img
            src="/src/assets/welearn-hero.png"
            alt="WeLearn Online Courses"
            className="rounded-3xl shadow-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-500 mb-20 object-cover"
          />
        </motion.div>
      </section>

      {/* 📜 Glowing Quotations Banner */}
      <section className="py-20 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-purple-950/10 to-gray-950"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 p-8 sm:p-12 rounded-3xl backdrop-blur-xl shadow-2xl relative"
          >
            <FaQuoteLeft className="text-4xl text-purple-400/30 mx-auto mb-6" />
            <blockquote className="text-xl sm:text-2xl font-medium text-gray-200 italic leading-relaxed">
              "The beautiful thing about learning is that no one can take it away from you — and the beautiful thing about teaching is that it multiplies when shared. WeLearn is engineered to make both simple, beautiful, and accessible."
            </blockquote>
            <cite className="block mt-6 text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold uppercase tracking-widest">
              — The WeLearn Manifesto
            </cite>
          </motion.div>
        </div>
      </section>

      {/* 👥 The Dual Hub: Creators vs Learners Banner */}
      <section className="py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              Who is this platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">made for?</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              We designed WeLearn with two distinct, interconnected experiences. Select your journey below:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Content Creators / Teachers */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-gradient-to-br from-purple-900/20 via-gray-950/40 to-gray-950/60 border border-purple-500/20 hover:border-purple-400/40 p-8 sm:p-10 rounded-3xl flex flex-col justify-between backdrop-blur-md shadow-xl transition-all"
            >
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-2xl shadow-inner">
                  <FaChalkboardTeacher />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  For Knowledge Creators & Teachers 🎨
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Have a skillset to share? Turn your expertise into high-quality video courses. 
                  Our educator panel provides stats tracking, instant publish states, and easy video lecture uploading. 
                  Empower learners, grow your personal brand, and make teaching a rewarding journey.
                </p>
              </div>
              <button
                onClick={handleStartTeaching}
                className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
              >
                Start Creator Account <FaArrowRight />
              </button>
            </motion.div>

            {/* Card 2: Students / Learners */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-gradient-to-br from-blue-900/20 via-gray-950/40 to-gray-950/60 border border-blue-500/20 hover:border-blue-400/40 p-8 sm:p-10 rounded-3xl flex flex-col justify-between backdrop-blur-md shadow-xl transition-all"
            >
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-2xl shadow-inner">
                  <FaLightbulb />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  For Students & Lifelong Learners 🎓
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Want to master React 19, Tailwind CSS v4, or secure database patterns? 
                  Search our expert-guided courses, watch free lectures previews, enroll in a click, 
                  and stream lessons. Learn at your own pace with a clean dashboard tracking all your enrollments.
                </p>
              </div>
              <button
                onClick={() => navigate("/courses")}
                className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
              >
                Browse Our Curriculum <FaArrowRight />
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 🌟 Statistics / Highlights Section */}
      <section className="py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-12">
            Why Enthusiasts <span className="text-pink-400">Choose WeLearn</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {/* Stat 1 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-white/5 backdrop-blur-md rounded-3xl shadow-xl p-6 hover:bg-white/10 transition-all border border-white/10"
            >
              <FaLaptopCode className="text-4xl text-blue-400 mb-3" />
              <h3 className="text-2xl font-semibold text-white">500+</h3>
              <p className="text-gray-400 mt-1 text-sm">Expert-Led Courses</p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-white/5 backdrop-blur-md rounded-3xl shadow-xl p-6 hover:bg-white/10 transition-all border border-white/10"
            >
              <MdGroups className="text-4xl text-purple-400 mb-3" />
              <h3 className="text-2xl font-semibold text-white">20K+</h3>
              <p className="text-gray-400 mt-1 text-sm">Active Learners</p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-white/5 backdrop-blur-md rounded-3xl shadow-xl p-6 hover:bg-white/10 transition-all border border-white/10"
            >
              <BsBuildingCheck className="text-4xl text-blue-300 mb-3" />
              <h3 className="text-2xl font-semibold text-white">1.5K+</h3>
              <p className="text-gray-400 mt-1 text-sm">Mentorship Sessions</p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-white/5 backdrop-blur-md rounded-3xl shadow-xl p-6 hover:bg-white/10 transition-all border border-white/10"
            >
              <FaUserGraduate className="text-4xl text-pink-400 mb-3" />
              <h3 className="text-2xl font-semibold text-white">98%</h3>
              <p className="text-gray-400 mt-1 text-sm">Learner Satisfaction</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-500 text-sm border-t border-white/10 bg-gray-950">
        <p className="mb-2">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-purple-400">WeLearn Hub</span> — Empowering continuous learning, skill sharing, and community growth for creators and students.
        </p>
        <p className="text-xs text-gray-600">Built with passion for the next generation of online learning.</p>
      </footer>
    </>
  );
}

export default Home;
