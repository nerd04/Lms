import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { FaBookOpen, FaUser } from "react-icons/fa";

function BrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async (searchTerm = "") => {
    setLoading(true);
    try {
      const url = searchTerm
        ? `${serverUrl}/api/courses?search=${encodeURIComponent(searchTerm)}`
        : `${serverUrl}/api/courses`;
      const res = await axios.get(url, { withCredentials: true });
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses(search);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-6 pt-28 pb-20 relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Explore Our Courses
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Unlock your potential with expert-led structured courses on modern development technologies.
            </p>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto mb-16 flex items-center bg-white/5 border border-white/10 rounded-full p-2 backdrop-blur-xl shadow-lg focus-within:ring-2 focus-within:ring-purple-500 transition-all"
          >
            <input
              type="text"
              placeholder="Search courses, frameworks, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent px-6 py-3 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white hover:scale-105 transition-transform"
              aria-label="Search button"
            >
              <IoSearch className="text-xl" />
            </button>
          </form>

          {/* Catalog Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <FaBookOpen className="text-5xl text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-300">No courses found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your search queries or keywords</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {courses.map((course) => (
                <motion.div
                  key={course._id}
                  whileHover={{ y: -6 }}
                  className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all backdrop-blur-md"
                >
                  {/* Thumbnail */}
                  <div className="h-48 overflow-hidden relative group cursor-pointer" onClick={() => navigate(`/courses/${course._id}`)}>
                    <img
                      src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent"></div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="text-2xl font-bold text-white hover:text-purple-300 transition-colors cursor-pointer line-clamp-1"
                      >
                        {course.title}
                      </h2>
                      <p className="text-gray-400 text-sm mt-3 line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Price and Educator info */}
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-400/40">
                          {course.educator?.imageUrl ? (
                            <img
                              src={course.educator.imageUrl}
                              alt={course.educator.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-purple-700/50 flex items-center justify-center">
                              <FaUser className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Instructor</p>
                          <p className="text-sm font-semibold text-gray-200">{course.educator?.name || "Educator"}</p>
                        </div>
                      </div>

                      <div>
                        {course.price === 0 ? (
                          <span className="px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">
                            Free
                          </span>
                        ) : (
                          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            ${course.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

export default BrowseCourses;
