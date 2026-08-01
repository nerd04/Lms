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
        <div className="min-h-screen bg-[#faf9f5] flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-650"></div>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#faf9f5] text-zinc-800 flex flex-col justify-center items-center px-6">
          <FaBookOpen className="text-6xl text-indigo-600 mb-4" />
          <h2 className="text-3xl font-bold">Course Not Found</h2>
          <button
            onClick={() => navigate("/courses")}
            className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition"
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

      <div className="min-h-screen bg-[#faf9f5] text-zinc-800 pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Soft decorative blobs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl opacity-40"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Video Player or Preview, Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Video Player / Course Poster */}
            <div className="aspect-video bg-zinc-900 rounded-3xl border border-zinc-200 overflow-hidden relative shadow-md">
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
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10 flex items-center gap-1.5">
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-950/70">
                    <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-4">
                      <FaLock className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Enroll to Unlock All Lectures</h3>
                    <p className="text-sm text-zinc-350 mt-2 max-w-sm">
                      Get unlimited lifetime access to all lectures, videos, and materials.
                    </p>
                    {!hasAccess && (
                      <button
                        onClick={handleEnroll}
                        disabled={enrollLoading}
                        className="mt-6 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors font-bold rounded-full shadow-lg cursor-pointer"
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
              <div className="bg-white rounded-3xl border border-[#e8e6df] p-6 shadow-sm">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  Playing Lecture
                </span>
                <h2 className="text-2xl font-bold mt-1 text-zinc-800">{activeLecture.title}</h2>
                {activeLecture.description && (
                  <p className="text-zinc-600 mt-3 text-sm leading-relaxed font-medium">{activeLecture.description}</p>
                )}
              </div>
            )}

            {/* Course Information */}
            <div className="bg-white rounded-3xl border border-[#e8e6df] p-8 shadow-sm space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-zinc-800 tracking-tight">{course.title}</h1>
                <p className="text-zinc-600 mt-4 leading-relaxed text-sm font-medium">{course.description}</p>
              </div>

              {/* Stats / Badges */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-zinc-100">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-zinc-50 border border-zinc-200 rounded-full text-xs text-zinc-600 font-semibold">
                  <FaClock className="text-indigo-600" />
                  {course.lectures?.length || 0} Lectures
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-zinc-50 border border-zinc-200 rounded-full text-xs text-zinc-600 font-semibold">
                  <FaUser className="text-amber-600" />
                  {course.enrolledStudents?.length || 0} Enrolled Students
                </span>
                {course.isPublished && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full text-xs text-emerald-700 font-semibold">
                    <IoCheckmarkCircle className="text-emerald-600" />
                    Published
                  </span>
                )}
              </div>

              {/* Instructor Card */}
              <div className="pt-6 border-t border-zinc-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-200">
                  {course.educator?.imageUrl ? (
                    <img
                      src={course.educator.imageUrl}
                      alt={course.educator.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                      <FaUser className="text-indigo-400 text-sm" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Instructed by</p>
                  <h4 className="text-base font-bold text-zinc-700">{course.educator?.name}</h4>
                  <p className="text-xs text-zinc-500 font-semibold">{course.educator?.email}</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Lectures Sidebar */}
          <div className="space-y-6">
            
            {/* Enrollment Status Card (For non-enrolled students) */}
            {!hasAccess && (
              <div className="bg-white border border-[#e8e6df] shadow-sm rounded-3xl p-6 text-center space-y-4">
                <h3 className="text-xl font-bold text-zinc-800">
                  Join GrowTogether Hub
                </h3>
                <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
                  Learn at your own pace. Gain instant access to certificates, project materials, and discussions.
                </p>
                <div className="text-3xl font-black text-indigo-600">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={enrollLoading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-transform cursor-pointer"
                >
                  {enrollLoading ? "Enrolling..." : "Enroll Now"}
                </button>
              </div>
            )}

            {/* Lectures List */}
            <div className="bg-white border border-[#e8e6df] shadow-sm rounded-3xl p-6 flex flex-col">
              <h3 className="text-lg font-bold mb-4 text-zinc-800 flex items-center gap-2">
                <FaBookOpen className="text-indigo-600 text-sm" /> Course Curriculum
              </h3>
              
              {(!course.lectures || course.lectures.length === 0) ? (
                <p className="text-sm text-zinc-400 text-center py-8">No lectures added yet.</p>
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
                            ? "bg-indigo-50/80 border-indigo-200"
                            : "bg-zinc-50 border-zinc-100 hover:bg-zinc-100/60"
                        }`}
                      >
                        <div className="flex items-center gap-3 pr-2 flex-1">
                          <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                            isActive ? "bg-indigo-600 text-white" : "bg-zinc-200 text-zinc-500"
                          }`}>
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-bold truncate ${isActive ? "text-indigo-950" : "text-zinc-800"}`}>{lecture.title}</h4>
                            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1 font-medium">{lecture.description || "Video Lecture"}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          {isPlayable ? (
                            lecture.isFreePreview && !hasAccess ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-indigo-700 font-bold px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/50">
                                <FaEye /> Preview
                              </span>
                            ) : (
                              <FaPlay className={`text-xs ${isActive ? "text-indigo-600 animate-pulse" : "text-zinc-400"}`} />
                            )
                          ) : (
                            <FaLock className="text-xs text-zinc-400" />
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

