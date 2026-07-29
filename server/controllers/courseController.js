import { Course } from "../models/courseModel.js";
import { User } from "../models/userModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// helper to extract public_id from Cloudinary URL (if needed for deletion)
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const fileWithExtension = parts[parts.length - 1];
  const publicId = fileWithExtension.split(".")[0];
  return publicId;
};

// 1. Create a Course (Educator Only)
export const createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const educatorId = req.userId;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    let thumbnailUrl;
    if (req.file) {
      thumbnailUrl = await uploadOnCloudinary(req.file.path);
    }

    const course = await Course.create({
      title,
      description,
      price: price ? parseFloat(price) : 0,
      thumbnailUrl,
      educator: educatorId,
    });

    return res.status(201).json(course);
  } catch (error) {
    console.error("Create course error:", error);
    return res.status(500).json({ message: `Create course error: ${error.message}` });
  }
};

// 2. Get All Published Courses (Browse/Search)
export const getAllCourses = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { isPublished: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query)
      .populate("educator", "name imageUrl")
      .select("-lectures.videoUrl"); // Exclude full video URLs from lists

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    return res.status(500).json({ message: `Get courses error: ${error.message}` });
  }
};

// 3. Get Course By ID (With conditional video access)
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // may be undefined if guest, or defined if logged in

    const course = await Course.findById(id).populate("educator", "name imageUrl email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user is enrolled or is the educator
    const isEducator = userId && course.educator._id.toString() === userId.toString();
    const isEnrolled = userId && course.enrolledStudents.includes(userId);

    let sanitizedLectures = [];

    if (isEducator || isEnrolled) {
      // Full access
      sanitizedLectures = course.lectures;
    } else {
      // Restrict access: hide videoUrls for non-preview lectures
      sanitizedLectures = course.lectures.map((lecture) => {
        const lectureObj = lecture.toObject();
        if (!lecture.isFreePreview) {
          delete lectureObj.videoUrl;
        }
        return lectureObj;
      });
    }

    const courseObject = course.toObject();
    courseObject.lectures = sanitizedLectures;
    courseObject.isEnrolled = !!isEnrolled;
    courseObject.isEducator = !!isEducator;

    return res.status(200).json(courseObject);
  } catch (error) {
    console.error("Get course by ID error:", error);
    return res.status(500).json({ message: `Get course by ID error: ${error.message}` });
  }
};

// 4. Update Course (Educator Only & Owner Only)
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, isPublished } = req.body;
    const userId = req.userId;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify ownership
    if (course.educator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized. You do not own this course." });
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (price !== undefined) course.price = parseFloat(price);
    if (isPublished !== undefined) course.isPublished = isPublished === "true" || isPublished === true;

    if (req.file) {
      const newThumbnailUrl = await uploadOnCloudinary(req.file.path);
      if (newThumbnailUrl) {
        course.thumbnailUrl = newThumbnailUrl;
      }
    }

    await course.save();
    return res.status(200).json(course);
  } catch (error) {
    console.error("Update course error:", error);
    return res.status(500).json({ message: `Update course error: ${error.message}` });
  }
};

// 5. Delete Course (Educator Only & Owner Only)
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify ownership
    if (course.educator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized. You do not own this course." });
    }

    // Remove from students' enrolled courses list
    await User.updateMany(
      { enrolledCourses: id },
      { $pull: { enrolledCourses: id } }
    );

    // Delete course
    await Course.findByIdAndDelete(id);

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    return res.status(500).json({ message: `Delete course error: ${error.message}` });
  }
};

// 6. Enroll in a Course (Student Only)
export const enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.userId;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.isPublished) {
      return res.status(400).json({ message: "Cannot enroll in an unpublished course" });
    }

    // Check if student is educator of this course
    if (course.educator.toString() === studentId.toString()) {
      return res.status(400).json({ message: "You cannot enroll in your own course" });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    // Add student to course enrollments
    course.enrolledStudents.push(studentId);
    await course.save();

    // Add course to student's user profile
    await User.findByIdAndUpdate(studentId, {
      $addToSet: { enrolledCourses: id }
    });

    return res.status(200).json({ message: "Enrolled successfully", course });
  } catch (error) {
    console.error("Enroll course error:", error);
    return res.status(500).json({ message: `Enroll course error: ${error.message}` });
  }
};

// 7. Get My Enrolled/Created Courses
export const getMyCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let courses = [];
    if (user.role === "educator") {
      courses = await Course.find({ educator: userId });
    } else {
      courses = await Course.find({ enrolledStudents: userId }).populate("educator", "name imageUrl");
    }

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Get my courses error:", error);
    return res.status(500).json({ message: `Get my courses error: ${error.message}` });
  }
};

// 8. Add Lecture to Course (Educator Only & Owner Only)
export const addLecture = async (req, res) => {
  try {
    const { id } = req.params; // course ID
    const { title, description, isFreePreview } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(400).json({ message: "Lecture title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Lecture video file is required" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify ownership
    if (course.educator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized. You do not own this course." });
    }

    // Upload video
    const videoUrl = await uploadOnCloudinary(req.file.path);
    if (!videoUrl) {
      return res.status(500).json({ message: "Failed to upload video to Cloudinary" });
    }

    const newLecture = {
      title,
      description,
      videoUrl,
      isFreePreview: isFreePreview === "true" || isFreePreview === true,
    };

    course.lectures.push(newLecture);
    await course.save();

    return res.status(201).json(course);
  } catch (error) {
    console.error("Add lecture error:", error);
    return res.status(500).json({ message: `Add lecture error: ${error.message}` });
  }
};

// 9. Delete Lecture from Course (Educator Only & Owner Only)
export const deleteLecture = async (req, res) => {
  try {
    const { id, lectureId } = req.params;
    const userId = req.userId;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify ownership
    if (course.educator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized. You do not own this course." });
    }

    // Find lecture index
    const lectureIndex = course.lectures.findIndex(
      (l) => l._id.toString() === lectureId.toString()
    );

    if (lectureIndex === -1) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // Remove lecture
    course.lectures.splice(lectureIndex, 1);
    await course.save();

    return res.status(200).json({ message: "Lecture deleted successfully", course });
  } catch (error) {
    console.error("Delete lecture error:", error);
    return res.status(500).json({ message: `Delete lecture error: ${error.message}` });
  }
};
