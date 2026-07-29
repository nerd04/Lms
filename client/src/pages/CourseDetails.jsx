import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { serverUrl } from "../App";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaPlay, FaLock, FaEye, FaUser, FaClock, FaBookOpen } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [activeLecture, setActiveLecture] = useState(null);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/courses/${id}`, {
        withCredentials: true,
      });
      setCourse(res.data);
      // Set the first lecture as active if lectures exist
      if (res.data.lectures && res.data.lectures.length > 0) {
        // If enrolled/educator, set first. Otherwise set first free preview or first lecture (which will be locked)
        const firstPlayable = res.data.lectures.find(l => l.videoUrl || l.isFreePreview) || res.data.lectures[0];
        setActiveLecture(firstPlayable);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id, userData]);

  const handleEnroll = async () => {
    if (!userData) {
      toast.info("Please login to enroll in this course!");
      return navigate("/login");
    }

    setEnrollLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/courses/${id}/enroll`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message || "Enrolled successfully!");
      
      // Refresh user details to sync redux state
      const userRes = await axios.get(`${serverUrl}/api/user/getcurrentuser`, {
        withCredentials: true,
      });
      dispatch(setUserData(userRes.data));
      
      // Re-fetch course details to unlock lectures
      await fetchCourseDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleLectureSelect = (lecture) => {
    if (!course.isEducator && !course.isEnrolled && !lecture.isFreePreview) {
      toast.error("Please enroll in this course to watch this lecture!");
      return;
    }
    setActiveLecture(lecture);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-950 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center px-6">
          <FaBookOpen className="text-6xl text-purple-400 mb-4" />
          <h2 className="text-3xl font-bold">Course Not Found</h2>
          <button
            onClick={() => navigate("/courses")}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold"
          >
            Browse Courses
          </button>
        </div>
      </>
    );
  }

  const hasAccess = course.isEnrolled || course.isEducator;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white pt-28 pb-20 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Video Player or Preview, Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Video Player / Course Poster */}
            <div className="aspect-video bg-black/40 rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl backdrop-blur-md">
              {hasAccess && activeLecture && activeLecture.videoUrl ? (
                <video
                  src={activeLecture.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster={course.thumbnailUrl}
                />
              ) : !hasAccess && activeLecture && activeLecture.isFreePreview && activeLecture.videoUrl ? (
                <div className="w-full h-full flex flex-col justify-between">
                  <video
                    src={activeLecture.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    poster={course.thumbnailUrl}
                  />
                  <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1.5">
                    <FaEye /> Free Preview
                  </div>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"}
                    alt={course.title}
                    className="w-full h-full object-cover filter blur-sm opacity-50"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-4">
                      <FaLock className="text-2xl text-purple-300" />
                    </div>
                    <h3 className="text-xl font-bold">Enroll to Unlock All Lectures</h3>
                    <p className="text-sm text-gray-400 mt-2 max-w-sm">
                      Get unlimited lifetime access to all lectures, videos, and materials.
                    </p>
                    {!hasAccess && (
                      <button
                        onClick={handleEnroll}
                        disabled={enrollLoading}
                        className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-transform font-bold rounded-full shadow-lg"
                      >
                        {enrollLoading ? "Enrolling..." : course.price === 0 ? "Enroll for Free" : `Enroll Now - $${course.price}`}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Active Lecture Details */}
            {activeLecture && (hasAccess || activeLecture.isFreePreview) && (
              <div className="bg-white/5 rounded-3xl border border-white/10 p-6 backdrop-blur-md">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
                  Playing Lecture
                </span>
                <h2 className="text-2xl font-bold mt-1 text-white">{activeLecture.title}</h2>
                {activeLecture.description && (
                  <p className="text-gray-300 mt-3 text-sm leading-relaxed">{activeLecture.description}</p>
                )}
              </div>
            )}

            {/* Course Information */}
            <div className="bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-md space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-white">{course.title}</h1>
                <p className="text-gray-300 mt-4 leading-relaxed text-sm">{course.description}</p>
              </div>

              {/* Stats / Badges */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                  <FaClock className="text-purple-400" />
                  {course.lectures?.length || 0} Lectures
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                  <FaUser className="text-blue-400" />
                  {course.enrolledStudents?.length || 0} Enrolled Students
                </span>
                {course.isPublished && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-300">
                    <IoCheckmarkCircle />
                    Published
                  </span>
                )}
              </div>

              {/* Instructor Card */}
              <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-purple-400/40">
                  {course.educator?.imageUrl ? (
                    <img
                      src={course.educator.imageUrl}
                      alt={course.educator.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-700/50 flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Instructed by</p>
                  <h4 className="text-base font-bold text-gray-200">{course.educator?.name}</h4>
                  <p className="text-xs text-gray-400">{course.educator?.email}</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Lectures Sidebar */}
          <div className="space-y-6">
            
            {/* Enrollment Status Card (For non-enrolled students) */}
            {!hasAccess && (
              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-md text-center space-y-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                  Join WeLearn Community
                </h3>
                <p className="text-xs text-gray-300">
                  Learn at your own pace. Gain instant access to certificates, project materials, and discussions.
                </p>
                <div className="text-2xl font-extrabold text-white">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={enrollLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-md hover:scale-105 transition-transform"
                >
                  {enrollLoading ? "Enrolling..." : "Enroll Now"}
                </button>
              </div>
            )}

            {/* Lectures List */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col">
              <h3 className="text-lg font-bold mb-4 text-gray-100 flex items-center gap-2">
                <FaBookOpen className="text-purple-400 text-sm" /> Course Curriculum
              </h3>
              
              {(!course.lectures || course.lectures.length === 0) ? (
                <p className="text-sm text-gray-500 text-center py-8">No lectures added yet.</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {course.lectures.map((lecture, index) => {
                    const isPlayable = hasAccess || lecture.isFreePreview;
                    const isActive = activeLecture && activeLecture._id === lecture._id;

                    return (
                      <div
                        key={lecture._id}
                        onClick={() => handleLectureSelect(lecture)}
                        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${
                          isActive
                            ? "bg-purple-600/20 border-purple-500/50"
                            : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3 pr-2 flex-1">
                          <span className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                            isActive ? "bg-purple-500 text-white" : "bg-white/10 text-gray-400"
                          }`}>
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate">{lecture.title}</h4>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{lecture.description || "Video Lecture"}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          {isPlayable ? (
                            lecture.isFreePreview && !hasAccess ? (
                              <span className="inline-flex items-center gap-1 text-xs text-purple-400 font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20">
                                <FaEye /> Preview
                              </span>
                            ) : (
                              <FaPlay className={`text-xs ${isActive ? "text-purple-400 animate-pulse" : "text-gray-400"}`} />
                            )
                          ) : (
                            <FaLock className="text-xs text-gray-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default CourseDetails;
