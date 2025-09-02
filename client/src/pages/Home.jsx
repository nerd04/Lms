import React from "react";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar/>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-6 bg-[url('/src/assets/hero-bg-img.png')] bg-cover bg-center bg-opacity-50">
      {/* Hero Section */}
      <div className="max-w-3xl text-center ">
        <h1 className="text-4xl md:text-6xl font-bold text-indigo-700 drop-shadow-sm">
          Welcome to <span className="text-orange-500">We Learn</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600">
          Your personal learning management system. Track progress, explore new
          skills, and achieve your goals with ease.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-indigo-700 transition duration-300">
            Get Started
          </button>
          <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-orange-600 transition duration-300">
            Explore Courses
          </button>
        </div>
      </div>

    </div>
      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} We Learn. All rights reserved.
      </footer>
    </>
  );
}

export default Home;
