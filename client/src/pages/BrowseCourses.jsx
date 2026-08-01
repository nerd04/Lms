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

      <div className="min-h-screen bg-[#faf9f5] text-zinc-800 px-6 pt-32 pb-20 relative overflow-hidden">
        {/* Soft Decorative Blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl opacity-40"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-800 tracking-tight mb-4">
              Explore Our Courses
            </h1>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto font-medium">
              Unlock your potential with expert-led structured courses on modern development technologies.
            </p>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto mb-16 flex items-center bg-white border border-[#e8e6df] rounded-full p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all"
          >
            <input
              type="text"
              placeholder="Search courses, frameworks, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent px-6 py-3 text-zinc-800 placeholder-zinc-400 focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="p-4 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 hover:scale-105 transition-all shadow-sm cursor-pointer"
              aria-label="Search button"
            >
              <IoSearch className="text-xl" />
            </button>
          </form>

          {/* Catalog Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#e8e6df] rounded-3xl shadow-sm">
              <FaBookOpen className="text-5xl text-zinc-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-zinc-750">No courses found</h3>
              <p className="text-zinc-500 mt-2">Try adjusting your search queries or keywords</p>
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
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl border border-[#e8e6df] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
                >
                  {/* Thumbnail */}
                  <div className="h-48 overflow-hidden relative group cursor-pointer" onClick={() => navigate(`/courses/${course._id}`)}>
                    <img
                      src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="text-xl font-bold text-zinc-800 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                      >
                        {course.title}
                      </h2>
                      <p className="text-zinc-550 text-sm mt-3 line-clamp-3 leading-relaxed font-medium">
                        {course.description}
                      </p>
                    </div>

                    {/* Price and Educator info */}
                    <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200">
                          {course.educator?.imageUrl ? (
                            <img
                              src={course.educator.imageUrl}
                              alt={course.educator.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                              <FaUser className="text-indigo-400 text-xs" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Instructor</p>
                          <p className="text-sm font-semibold text-zinc-700">{course.educator?.name || "Educator"}</p>
                        </div>
                      </div>

                      <div>
                        {course.price === 0 ? (
                          <span className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full">
                            Free
                          </span>
                        ) : (
                          <span className="text-lg font-extrabold text-indigo-600">
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

