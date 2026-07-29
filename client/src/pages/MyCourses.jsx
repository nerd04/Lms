import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaBookOpen, FaPlay, FaUser, FaPlus } from "react-icons/fa";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/courses/my-courses/all`, {
        withCredentials: true,
      });
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    } else {
      fetchMyCourses();
    }
  }, [userData]);

  const isEducator = userData?.role === "educator";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-6 pt-28 pb-20 relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-20 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {isEducator ? "My Created Courses" : "My Enrolled Courses"}
              </h1>
              <p className="text-gray-400 mt-1">
                {isEducator
                  ? "View and manage all the course curriculums you have created."
                  : "Pick up right where you left off and keep expanding your skillset."}
              </p>
            </div>

            {isEducator && (
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold shadow-md hover:scale-105 transition-transform"
              >
                Go to Dashboard
              </button>
            )}
          </div>

          {/* Grid list */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <FaBookOpen className="text-5xl text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-300">
                {isEducator ? "No courses created yet" : "No enrolled courses yet"}
              </h3>
              <p className="text-gray-400 mt-2 max-w-sm mx-auto text-sm leading-relaxed">
                {isEducator
                  ? "You haven't designed any courses yet. Go to your dashboard to create one!"
                  : "You haven't enrolled in any courses yet. Explore our catalog to find something you love!"}
              </p>
              <button
                onClick={() => navigate(isEducator ? "/dashboard" : "/courses")}
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold hover:scale-105 transition-transform"
              >
                {isEducator ? "Create Course" : "Browse Courses"}
              </button>
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
                  <div
                    className="h-44 overflow-hidden relative group cursor-pointer"
                    onClick={() => navigate(isEducator ? `/dashboard` : `/courses/${course._id}`)}
                  >
                    <img
                      src={
                        course.thumbnailUrl ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {isEducator ? <FaPlus /> : <FaPlay className="ml-1" />}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2
                        onClick={() => navigate(isEducator ? `/dashboard` : `/courses/${course._id}`)}
                        className="text-xl font-bold text-white hover:text-purple-300 transition-colors cursor-pointer line-clamp-1"
                      >
                        {course.title}
                      </h2>
                      <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Stats & Instructor */}
                    <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                      {!isEducator && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-400/40">
                            {course.educator?.imageUrl ? (
                              <img
                                src={course.educator.imageUrl}
                                alt={course.educator.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-purple-700/50 flex items-center justify-center">
                                <FaUser className="text-white text-[10px]" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500">Instructor</p>
                            <p className="text-xs font-semibold text-gray-300">
                              {course.educator?.name || "Educator"}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-gray-400 font-semibold">
                        {course.lectures?.length || 0} Lectures
                      </div>
                      
                      {isEducator && (
                        <div className="text-xs text-gray-400 font-semibold">
                          {course.enrolledStudents?.length || 0} Students
                        </div>
                      )}
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

export default MyCourses;
