import React, { useState, useRef, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import {
  FaUserGraduate,
  FaUserEdit,
  FaCamera,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";

// 🧿 Read-only Avatar
function ReadOnlyAvatar({ src, name }) {
  return (
    <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-purple-400 shadow-lg shadow-purple-400/20">
      <img
        src={src}
        alt={`${name}'s avatar`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
    </div>
  );
}

// ✏️ Edit Profile Card
function EditProfile({ userData, handleEditSave, onCancel, Loading }) {
  const fileRef = useRef(null);
  const newName = useRef();
  const newEmail = useRef();
  const newRole = useRef();

  const handleUploadClick = () => fileRef.current.click();

  const handleChange = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newName.current.value);
    formData.append("email", newEmail.current.value);
    formData.append("role", newRole.current.value);
    formData.append("imageUrl", fileRef.current.files[0]);
    handleEditSave(formData);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl w-full max-w-3xl p-6 sm:p-10 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 opacity-50"></div>

      <form onSubmit={handleChange} className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-purple-400 shadow-lg shadow-purple-400/30">
              <img
                src={userData.imageUrl}
                alt="preview avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-purple-300">Profile Photo</label>
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 transition-transform"
                >
                  <FaCamera /> Upload
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:scale-105 transition-transform"
            >
              <FaSave /> {Loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 transition-all"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-purple-300">Full Name</label>
            <input
              ref={newName}
              defaultValue={userData.name}
              className="mt-2 w-full rounded-xl px-4 py-2 bg-gray-800/50 border border-purple-400/30 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-purple-300">Email</label>
            <input
              ref={newEmail}
              defaultValue={userData.email}
              disabled
              className="mt-2 w-full rounded-xl px-4 py-2 bg-gray-800/50 border border-purple-400/30 text-gray-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-purple-300">Role</label>
            <select
              ref={newRole}
              defaultValue={userData.role}
              className="mt-2 w-full rounded-xl px-4 py-2 bg-gray-800/50 border border-purple-400/30 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="student">Student</option>
              <option value="educator">Educator</option>
            </select>
          </div>
        </div>

        {/* Drag & Drop Info */}
        <div className="mt-6 rounded-xl border-2 border-dashed border-purple-400/30 p-6 text-center">
          <p className="text-sm text-purple-200">
            Drag & drop an image here, or{" "}
            <button
              type="button"
              onClick={handleUploadClick}
              className="text-purple-400 underline"
            >
              browse
            </button>
          </p>
        </div>
      </form>
    </motion.section>
  );
}

function ProfileCard({ userData, onEdit }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl w-full max-w-3xl p-8 sm:p-10 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-gray-900/40 to-blue-900/30 opacity-60"></div>

      <div className="relative flex flex-col items-center text-center gap-6 z-10">
        {/* Avatar */}
        <ReadOnlyAvatar src={userData.imageUrl} name={userData.name} />

        {/* User Info */}
        <div className="w-full flex flex-col items-center gap-3">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {userData.name}
          </h1>

          <div className="flex flex-col items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                userData.role === "educator"
                  ? "bg-orange-400/20 text-orange-300 border border-orange-400/30"
                  : "bg-blue-400/20 text-blue-300 border border-blue-400/30"
              }`}
            >
              {userData.role === "educator" ? <GiTeacher /> : <FaUserGraduate />}
              <span className="capitalize">{userData.role}</span>
            </span>

            <span className="inline-flex items-center gap-2 text-gray-300 text-sm">
              <MdEmail className="text-lg text-purple-300" />
              <span className="break-all">{userData.email}</span>
            </span>
          </div>

          {/* Enrolled Info */}
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl px-6 py-4 text-center border border-purple-500/30 w-40 sm:w-56 mt-4">
            <p className="text-purple-300 text-sm font-medium tracking-wide">
              Enrolled Courses
            </p>
            <p className="text-2xl font-bold text-white mt-1">
              {userData.enrolledCourses || "0"}
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:scale-105 transition-transform"
        >
          <FaUserEdit /> Edit Profile
        </button>
      </div>
    </motion.section>
  );
}


// 🌈 Main Component
export default function Profile() {
  const [mode, setMode] = useState("view");
  const { userData } = useSelector((state) => state.user);
  const [Loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditSave = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/updateprofile`,
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(setUserData(res.data));
      toast.success("Profile updated successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950 flex items-start justify-center px-4 py-14">
      <div className="w-full max-w-4xl space-y-6">
        <AnimatePresence mode="wait">
          {mode === "view" ? (
            <>
              <div
                className="absolute cursor-pointer z-10 bg-white  hover:scale-150 transition-transform"
                onClick={() => navigate("/")}
              >
                <IoArrowBack />
              </div>
              <ProfileCard
                key="view"
                userData={userData}
                onEdit={() => setMode("edit")}
              />
            </>
          ) : (
            <>
              <div
                className="absolute cursor-pointer z-10 bg-white  hover:scale-150 transition-transform"
                onClick={() => navigate("/")}
              >
                <IoArrowBack />
              </div>
              <EditProfile
                key="edit"
                userData={userData}
                handleEditSave={handleEditSave}
                onCancel={() => setMode("view")}
                Loading={Loading}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
