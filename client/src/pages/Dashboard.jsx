import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { motion as motionFramer, AnimatePresence as AnimatePresenceFramer } from "framer-motion";
import {
  FaPlus,
  FaTrash,
  FaVideo,
  FaBookOpen,
  FaChartLine,
  FaUsers,
  FaTimes,
  FaArrowLeft,
  FaUpload,
} from "react-icons/fa";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0 });

  // Modals / Navigation states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeCourseForLectures, setActiveCourseForLectures] = useState(null);

  // Form states - Create Course
  const courseTitle = useRef();
  const courseDesc = useRef();
  const coursePrice = useRef();
  const [courseThumbnail, setCourseThumbnail] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);

  // Form states - Add Lecture
  const lectureTitle = useRef();
  const lectureDesc = useRef();
  const [lectureFreePreview, setLectureFreePreview] = useState(false);
  const [lectureVideo, setLectureVideo] = useState(null);
  const [addLectureLoading, setAddLectureLoading] = useState(false);

  const fetchEducatorDashboardData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/courses/my-courses/all`, {
        withCredentials: true,
      });
      setCourses(res.data);

      // Calculate simple stats
      const totalCourses = res.data.length;
      const totalStudents = res.data.reduce(
        (acc, course) => acc + (course.enrolledStudents?.length || 0),
        0
      );
      setStats({ totalCourses, totalStudents });

      // If we are currently managing lectures, update the active course reference
      if (activeCourseForLectures) {
        const updatedCourse = res.data.find(c => c._id === activeCourseForLectures._id);
        if (updatedCourse) {
          setActiveCourseForLectures(updatedCourse);
        }
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducatorDashboardData();
  }, []);

  // 1. Handle Create Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const titleVal = courseTitle.current.value;
    const descVal = courseDesc.current.value;
    const priceVal = coursePrice.current.value;

    if (!titleVal || !descVal) {
      return toast.error("Title and Description are required");
    }

    const formData = new FormData();
    formData.append("title", titleVal);
    formData.append("description", descVal);
    formData.append("price", priceVal || 0);
    if (courseThumbnail) {
      formData.append("thumbnailUrl", courseThumbnail);
    }

    setCreateLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/api/courses`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Course created successfully!");
      setShowCreateModal(false);
      setCourseThumbnail(null);
      fetchEducatorDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setCreateLoading(false);
    }
  };

  // 2. Handle Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course and all its lectures?")) return;

    try {
      await axios.delete(`${serverUrl}/api/courses/${courseId}`, {
        withCredentials: true,
      });
      toast.success("Course deleted successfully");
      fetchEducatorDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course");
    }
  };

  // 3. Handle Add Lecture
  const handleAddLecture = async (e) => {
    e.preventDefault();
    const titleVal = lectureTitle.current.value;
    const descVal = lectureDesc.current.value;

    if (!titleVal) return toast.error("Lecture title is required");
    if (!lectureVideo) return toast.error("Lecture video file is required");

    const formData = new FormData();
    formData.append("title", titleVal);
    formData.append("description", descVal || "");
    formData.append("isFreePreview", lectureFreePreview);
    formData.append("videoUrl", lectureVideo);

    setAddLectureLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/courses/${activeCourseForLectures._id}/lectures`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success("Lecture added successfully!");
      setLectureVideo(null);
      setLectureFreePreview(false);
      // Reset form fields
      lectureTitle.current.value = "";
      lectureDesc.current.value = "";
      
      // Update local state
      fetchEducatorDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lecture");
    } finally {
      setAddLectureLoading(false);
    }
  };

  // 4. Handle Delete Lecture
  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Delete this lecture?")) return;

    try {
      await axios.delete(
        `${serverUrl}/api/courses/${activeCourseForLectures._id}/lectures/${lectureId}`,
        { withCredentials: true }
      );
      toast.success("Lecture deleted successfully");
      fetchEducatorDashboardData();
    } catch (error) {
      toast.error("Failed to delete lecture");
    }
  };

  // 5. Toggle publish state
  const handlePublishToggle = async (course) => {
    try {
      await axios.put(
        `${serverUrl}/api/courses/${course._id}`,
        { isPublished: !course.isPublished },
        { withCredentials: true }
      );
      toast.success(course.isPublished ? "Course unpublished" : "Course published! 🚀");
      fetchEducatorDashboardData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#faf9f5] text-zinc-800 px-6 pt-32 pb-20 relative overflow-hidden">
        {/* Soft Background blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl opacity-40"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {activeCourseForLectures ? (
            /* ========================================================================= */
            /* 🎥 LECTURES MANAGEMENT CONTAINER                                          */
            /* ========================================================================= */
            <motionFramer.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Back link */}
              <button
                onClick={() => setActiveCourseForLectures(null)}
                className="flex items-center gap-2 text-indigo-650 hover:text-indigo-750 transition-colors font-semibold cursor-pointer"
              >
                <FaArrowLeft /> Back to Dashboard
              </button>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-zinc-800 tracking-tight">
                    Manage Curriculum
                  </h1>
                  <p className="text-zinc-500 mt-1 font-semibold text-sm">
                    Course: <span className="text-indigo-600 font-extrabold">{activeCourseForLectures.title}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Panel: Lectures List */}
                <div className="lg:col-span-2 bg-white border border-[#e8e6df] rounded-3xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-6 text-zinc-800 flex items-center gap-2">
                    <FaBookOpen className="text-indigo-600" /> Current Lectures ({activeCourseForLectures.lectures?.length || 0})
                  </h2>

                  {(!activeCourseForLectures.lectures || activeCourseForLectures.lectures.length === 0) ? (
                    <div className="text-center py-20 text-zinc-400">
                      <FaVideo className="text-5xl mx-auto mb-4 text-zinc-300" />
                      <p className="font-semibold">No lectures uploaded for this course yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {activeCourseForLectures.lectures.map((lecture, index) => (
                        <div
                          key={lecture._id}
                          className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-150 hover:border-zinc-300 rounded-2xl transition"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-sm text-indigo-700">
                              {index + 1}
                            </span>
                            <div>
                              <h4 className="font-bold text-zinc-800 flex items-center gap-2">
                                {lecture.title}
                                {lecture.isFreePreview && (
                                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50 rounded">
                                    Free Preview
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-zinc-500 font-semibold mt-0.5 line-clamp-1">{lecture.description}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteLecture(lecture._id)}
                            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition cursor-pointer"
                            title="Delete Lecture"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Panel: Add Lecture Form */}
                <div className="bg-white border border-[#e8e6df] rounded-3xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-6 text-zinc-800 flex items-center gap-2">
                    <FaPlus className="text-indigo-600" /> Add Lecture
                  </h2>

                  <form onSubmit={handleAddLecture} className="space-y-5">
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                        Lecture Title
                      </label>
                      <input
                        ref={lectureTitle}
                        type="text"
                        placeholder="e.g. 1. Introduction to Variables"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-800 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                        Description
                      </label>
                      <textarea
                        ref={lectureDesc}
                        rows={3}
                        placeholder="Provide details on what this lecture covers..."
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-800 font-medium"
                      />
                    </div>

                    {/* Free Preview Toggle */}
                    <div className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        id="isFreePreview"
                        checked={lectureFreePreview}
                        onChange={(e) => setLectureFreePreview(e.target.checked)}
                        className="w-4.5 h-4.5 text-indigo-650 bg-white border-zinc-200 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="isFreePreview" className="text-sm font-semibold text-zinc-700 cursor-pointer select-none">
                        Allow Free Preview (Guest Viewing)
                      </label>
                    </div>

                    {/* Video File Upload */}
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                        Lecture Video File
                      </label>
                      <div className="border-2 border-dashed border-zinc-200 hover:border-indigo-500/40 rounded-2xl p-4 text-center cursor-pointer relative group transition-colors">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => setLectureVideo(e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <FaUpload className="text-3xl text-indigo-500 mx-auto mb-2 group-hover:scale-105 transition-transform" />
                        {lectureVideo ? (
                          <span className="text-sm font-bold text-emerald-600 block truncate">
                            Selected: {lectureVideo.name}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-400 font-semibold block">
                            Click to select MP4/MOV file
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={addLectureLoading}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                    >
                      {addLectureLoading ? "Uploading Video..." : "Upload & Save Lecture"}
                    </button>
                  </form>
                </div>

              </div>

            </motionFramer.div>
          ) : (
            /* ========================================================================= */
            /* 📊 MAIN DASHBOARD CONTAINER                                               */
            /* ========================================================================= */
            <div className="space-y-12">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-4xl font-extrabold text-zinc-800 tracking-tight">
                    Educator Command Center
                  </h1>
                  <p className="text-zinc-500 mt-1 font-semibold text-base">
                    Manage your curriculum, track student enrollment, and share knowledge.
                  </p>
                </div>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-md shadow-indigo-600/10 hover:scale-105 active:scale-95 transition cursor-pointer text-sm"
                >
                  <FaPlus /> Create Course
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="bg-white border border-[#e8e6df] rounded-3xl p-6 flex items-center gap-4 shadow-sm">
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                    <FaBookOpen className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Total Courses</p>
                    <h3 className="text-3xl font-extrabold text-zinc-800 mt-1">{stats.totalCourses}</h3>
                  </div>
                </div>

                <div className="bg-white border border-[#e8e6df] rounded-3xl p-6 flex items-center gap-4 shadow-sm">
                  <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                    <FaUsers className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Total Students</p>
                    <h3 className="text-3xl font-extrabold text-zinc-800 mt-1">{stats.totalStudents}</h3>
                  </div>
                </div>

                <div className="bg-white border border-[#e8e6df] rounded-3xl p-6 flex items-center gap-4 shadow-sm">
                  <div className="p-4 bg-pink-50 text-pink-600 rounded-2xl border border-pink-100">
                    <FaChartLine className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Projected Income</p>
                    <h3 className="text-3xl font-extrabold text-zinc-800 mt-1">Active</h3>
                  </div>
                </div>

              </div>

              {/* Courses Table/Grid */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zinc-800 tracking-tight">
                  Your Courses
                </h2>

                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-[#e8e6df] rounded-3xl shadow-sm">
                    <FaBookOpen className="text-4xl text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-zinc-700">No courses created yet</h3>
                    <p className="text-zinc-500 mt-2 font-medium">Get started by creating your first course catalog</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition shadow-sm cursor-pointer"
                    >
                      Create Course
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div
                        key={course._id}
                        className="bg-white border border-[#e8e6df] rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm"
                      >
                        <div className="h-40 overflow-hidden relative">
                          <img
                            src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              course.isPublished
                                ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                                : "bg-amber-50 text-amber-700 border-amber-250"
                            }`}>
                              {course.isPublished ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h3 className="text-lg font-bold truncate text-zinc-800">{course.title}</h3>
                            <p className="text-xs text-zinc-500 font-semibold mt-1 line-clamp-2">{course.description}</p>
                          </div>

                          <div className="flex justify-between items-center text-xs text-zinc-400 font-bold">
                            <span>{course.lectures?.length || 0} Lectures</span>
                            <span>{course.enrolledStudents?.length || 0} Students</span>
                          </div>

                          <div className="pt-4 border-t border-zinc-100 flex flex-wrap gap-2">
                            <button
                              onClick={() => setActiveCourseForLectures(course)}
                              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition cursor-pointer"
                            >
                              Curriculum
                            </button>
                            <button
                              onClick={() => handlePublishToggle(course)}
                              className="px-3 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold text-xs transition cursor-pointer"
                            >
                              {course.isPublished ? "Unpublish" : "Publish"}
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition cursor-pointer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚀 CREATE COURSE DIALOG MODAL                                              */}
      {/* ========================================================================= */}
      <AnimatePresenceFramer>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motionFramer.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            ></motionFramer.div>

            {/* Content Card */}
            <motionFramer.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 text-zinc-800 z-10 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-zinc-800 tracking-tight">
                  Create New Course
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 transition text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  aria-label="Close modal"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                    Course Title
                  </label>
                  <input
                    ref={courseTitle}
                    type="text"
                    placeholder="e.g. Master React 19 from Scratch"
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-800 font-medium text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                    Course Description
                  </label>
                  <textarea
                    ref={courseDesc}
                    rows={4}
                    placeholder="Provide a detailed roadmap, prerequisites, and features of your course..."
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-800 font-medium text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                      Price ($)
                    </label>
                    <input
                      ref={coursePrice}
                      type="number"
                      step="0.01"
                      placeholder="0.00 (Leave free)"
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-zinc-800 font-medium text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                      Course Thumbnail
                    </label>
                    <div className="border-2 border-dashed border-zinc-200 hover:border-indigo-500/40 rounded-xl p-2.5 text-center cursor-pointer relative group transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCourseThumbnail(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-indigo-600 block group-hover:scale-105 transition-transform truncate">
                        {courseThumbnail ? courseThumbnail.name : "Select Image File"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:scale-[1.01] transition-all cursor-pointer text-sm"
                >
                  {createLoading ? "Creating Course..." : "Create & Launch"}
                </button>
              </form>
            </motionFramer.div>
          </div>
        )}
      </AnimatePresenceFramer>
    </>
  );
}

export default Dashboard;
