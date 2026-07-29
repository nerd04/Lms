import express from "express";
import { authUser, optionalAuth } from "../middlewares/checkAuth.js";
import { isEducator } from "../middlewares/checkRole.js";
import upload from "../middlewares/multer.js";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getMyCourses,
  addLecture,
  deleteLecture,
} from "../controllers/courseController.js";

const courseRouter = express.Router();

// Public routes
courseRouter.get("/", getAllCourses);
courseRouter.get("/:id", optionalAuth, getCourseById);

// Protected routes (All users)
courseRouter.get("/my-courses/all", authUser, getMyCourses);
courseRouter.post("/:id/enroll", authUser, enrollInCourse);

// Educator only routes
courseRouter.post("/", authUser, isEducator, upload.single("thumbnailUrl"), createCourse);
courseRouter.put("/:id", authUser, isEducator, upload.single("thumbnailUrl"), updateCourse);
courseRouter.delete("/:id", authUser, isEducator, deleteCourse);

// Lecture routes
courseRouter.post("/:id/lectures", authUser, isEducator, upload.single("videoUrl"), addLecture);
courseRouter.delete("/:id/lectures/:lectureId", authUser, isEducator, deleteLecture);

export default courseRouter;
