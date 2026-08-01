import React, { useState, useRef } from "react";
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
    <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-indigo-100 shadow-sm">
      <img
        src={src}
        alt={`${name}'s avatar`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 to-transparent"></div>
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
      className="bg-white rounded-3xl border border-[#e8e6df] shadow-sm w-full max-w-3xl p-6 sm:p-10 text-zinc-800 relative overflow-hidden"
    >
      <form onSubmit={handleChange} className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-indigo-100 shadow-sm">
              <img
                src={userData.imageUrl}
                alt="preview avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Profile Photo</label>
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition cursor-pointer text-sm"
                >
                  <FaCamera /> Upload Photo
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition cursor-pointer text-sm"
            >
              <FaSave /> {Loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold shadow-sm transition cursor-pointer text-sm"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Full Name</label>
            <input
              ref={newName}
              defaultValue={userData.name}
              className="w-full rounded-xl px-4 py-3 bg-white border border-zinc-200 text-zinc-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Email (Read Only)</label>
            <input
              ref={newEmail}
              defaultValue={userData.email}
              disabled
              className="w-full rounded-xl px-4 py-3 bg-zinc-50 border border-zinc-150 text-zinc-400 outline-none font-medium text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Account Role</label>
            <select
              ref={newRole}
              defaultValue={userData.role}
              className="w-full rounded-xl px-4 py-3 bg-white border border-zinc-200 text-zinc-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-sm cursor-pointer"
            >
              <option value="student">Student</option>
              <option value="educator">Educator</option>
            </select>
          </div>
        </div>

        {/* Drag & Drop Info */}
        <div className="rounded-xl border-2 border-dashed border-zinc-200 p-6 text-center">
          <p className="text-sm text-zinc-500 font-medium">
            Drag & drop an image here, or{" "}
            <button
              type="button"
              onClick={handleUploadClick}
              className="text-indigo-650 font-bold underline cursor-pointer hover:text-indigo-750"
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
      className="bg-white rounded-3xl border border-[#e8e6df] shadow-sm w-full max-w-3xl p-8 sm:p-10 text-zinc-850 relative overflow-hidden"
    >
      <div className="relative flex flex-col items-center text-center gap-6 z-10">
        {/* Avatar */}
        <ReadOnlyAvatar src={userData.imageUrl} name={userData.name} />

        {/* User Info */}
        <div className="w-full flex flex-col items-center gap-3">
          <h1 className="text-3xl font-extrabold text-zinc-800 tracking-tight">
            {userData.name}
          </h1>

          <div className="flex flex-col items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${
                userData.role === "educator"
                  ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                  : "bg-indigo-50 text-indigo-700 border border-indigo-200/60"
              }`}
            >
              {userData.role === "educator" ? <GiTeacher /> : <FaUserGraduate />}
              <span className="capitalize">{userData.role}</span>
            </span>

            <span className="inline-flex items-center gap-2 text-zinc-600 text-sm font-medium">
              <MdEmail className="text-lg text-indigo-600" />
              <span className="break-all">{userData.email}</span>
            </span>
          </div>

          {/* Enrolled Info */}
          <div className="bg-zinc-50 rounded-2xl px-6 py-4 text-center border border-zinc-150 w-40 sm:w-56 mt-4 shadow-inner">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
              Enrolled Courses
            </p>
            <p className="text-3xl font-black text-indigo-650 mt-1">
              {userData.enrolledCourses?.length || "0"}
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer text-sm"
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
    <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl opacity-40"></div>

      <div className="w-full max-w-4xl space-y-6 relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {mode === "view" ? (
            <React.Fragment key="view">
              <button
                className="absolute top-6 left-6 sm:left-0 cursor-pointer z-10 p-3 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition shadow-sm"
                onClick={() => navigate("/")}
                aria-label="Back to home"
              >
                <IoArrowBack className="text-xl" />
              </button>
              <div className="w-full flex justify-center mt-12 sm:mt-0">
                <ProfileCard
                  userData={userData}
                  onEdit={() => setMode("edit")}
                />
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment key="edit">
              <button
                className="absolute top-6 left-6 sm:left-0 cursor-pointer z-10 p-3 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition shadow-sm"
                onClick={() => navigate("/")}
                aria-label="Back to home"
              >
                <IoArrowBack className="text-xl" />
              </button>
              <div className="w-full flex justify-center mt-12 sm:mt-0">
                <EditProfile
                  userData={userData}
                  handleEditSave={handleEditSave}
                  onCancel={() => setMode("view")}
                  Loading={Loading}
                />
              </div>
            </React.Fragment>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
