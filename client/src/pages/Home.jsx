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
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#faf9f5] text-zinc-800 px-6">
        {/* Soft Decorative Background Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>

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
            className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest inline-block mb-6 shadow-sm"
          >
            We Are All Learners & We Are All Teachers 🌐
          </motion.span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-center drop-shadow-sm">
            <span className="black-shining-text">You Know Nothing <br />Even If You Know Everything</span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-zinc-600 leading-relaxed max-w-3xl mx-auto font-medium">
            The world is full of knowledge. Everyone has something to teach, and everyone has gaps to fill. 
            We designed this ecosystem for collaborative sharing: enabling students to teach what they know best, and teachers to learn where they lack skills.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/courses")}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-md hover:shadow-indigo-600/10 transition-all cursor-pointer"
            >
              <span>Explore What to Learn</span>
              <IoSearch className="text-xl" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleStartTeaching}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-full shadow-md hover:shadow-zinc-800/10 transition-all cursor-pointer"
            >
              <span>Share What You Know</span>
              <FaChalkboardTeacher className="text-xl" />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* 📜 Glowing Quotations Banner */}
      <section className="py-24 bg-[#f5f4ef] border-y border-[#e8e6df] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-[#e8e6df] p-8 sm:p-12 rounded-3xl shadow-sm relative"
          >
            <FaQuoteLeft className="text-4xl text-indigo-400/20 mx-auto mb-6" />
            <blockquote className="text-xl sm:text-2xl font-semibold text-zinc-700 italic leading-relaxed">
              "Everyone is a learner in this world. The world is full of knowledge; you know nothing even if you know everything. The moment you believe you have nothing left to learn is the moment you stop growing."
            </blockquote>
            <cite className="block mt-6 text-sm text-indigo-600 font-bold uppercase tracking-widest">
              — The GrowTogether Philosophy
            </cite>
          </motion.div>
        </div>
      </section>

      {/* 👥 The Dual Hub: Creators vs Learners Banner */}
      <section className="py-24 bg-[#faf9f5] px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-800">
              How do you want to <span className="text-indigo-600">participate today?</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto font-medium text-base">
              Everyone switches roles. Select your focus area below, and update it anytime from your profile page:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Content Creators / Teachers */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border border-[#e8e6df] hover:border-indigo-200 p-8 sm:p-10 rounded-3xl flex flex-col justify-between shadow-sm transition-all"
            >
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-2xl shadow-inner">
                  <FaChalkboardTeacher />
                </div>
                <h3 className="text-2xl font-bold text-zinc-800">
                  Teach What You Know Best 🎨
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed font-medium">
                  Are you a student with a unique perspective or deep knowledge in a niche? Step up and teach! 
                  Create structured video lectures, share your insights, build your personal brand, and multiply knowledge by sharing it.
                </p>
              </div>
              <button
                onClick={handleStartTeaching}
                className="mt-8 inline-flex items-center justify-center gap-2 w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl shadow-md transition-colors cursor-pointer"
              >
                Share Your Expertise <FaArrowRight />
              </button>
            </motion.div>

            {/* Card 2: Students / Learners */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border border-[#e8e6df] hover:border-indigo-200 p-8 sm:p-10 rounded-3xl flex flex-col justify-between shadow-sm transition-all"
            >
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 text-2xl shadow-inner">
                  <FaLightbulb />
                </div>
                <h3 className="text-2xl font-bold text-zinc-800">
                  Learn Where You Lack 🎓
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed font-medium">
                  Are you an experienced educator or developer looking to keep up with React 19, new security patterns, or soft skills? 
                  Explore peer-led materials, register in seconds, and expand your skillset.
                </p>
              </div>
              <button
                onClick={() => navigate("/courses")}
                className="mt-8 inline-flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition-colors cursor-pointer"
              >
                Explore Catalog & Learn <FaArrowRight />
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 🌟 Statistics / Highlights Section */}
      <section className="py-24 bg-[#f5f4ef] border-t border-[#e8e6df] relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-800 mb-12">
            Why Enthusiasts Choose <span className="text-indigo-600">GrowTogether</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center bg-white rounded-3xl shadow-sm p-6 border border-[#e8e6df]"
            >
              <FaLaptopCode className="text-4xl text-indigo-600 mb-3" />
              <h3 className="text-3xl font-extrabold text-zinc-800">500+</h3>
              <p className="text-zinc-500 mt-1 text-sm font-semibold">Expert-Led Courses</p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center bg-white rounded-3xl shadow-sm p-6 border border-[#e8e6df]"
            >
              <MdGroups className="text-4xl text-amber-600 mb-3" />
              <h3 className="text-3xl font-extrabold text-zinc-800">20K+</h3>
              <p className="text-zinc-500 mt-1 text-sm font-semibold">Active Learners</p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center bg-white rounded-3xl shadow-sm p-6 border border-[#e8e6df]"
            >
              <BsBuildingCheck className="text-4xl text-emerald-600 mb-3" />
              <h3 className="text-3xl font-extrabold text-zinc-800">1.5K+</h3>
              <p className="text-zinc-500 mt-1 text-sm font-semibold">Mentorship Sessions</p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center bg-white rounded-3xl shadow-sm p-6 border border-[#e8e6df]"
            >
              <FaUserGraduate className="text-4xl text-pink-600 mb-3" />
              <h3 className="text-3xl font-extrabold text-zinc-800">98%</h3>
              <p className="text-zinc-500 mt-1 text-sm font-semibold">Learner Satisfaction</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center text-zinc-500 text-sm border-t border-[#e8e6df] bg-[#faf9f5]">
        <p className="mb-2 font-semibold text-zinc-600">
          © {new Date().getFullYear()}{" "}
          <span className="font-extrabold text-indigo-600">GrowTogether Hub</span> — Empowering continuous learning, skill sharing, and community growth for creators and students.
        </p>
        <p className="text-xs text-zinc-400">Built with passion for the next generation of online learning.</p>
      </footer>
    </>
  );
}

export default Home;

