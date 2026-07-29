import { User } from "../models/userModel.js";

export const isEducator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "educator") {
      return res.status(403).json({ message: "Access denied. Only educators can perform this action." });
    }

    req.user = user; // Attach the user document to the request for reuse
    next();
  } catch (error) {
    console.error("Educator check error:", error);
    return res.status(500).json({ message: "Error validating user role" });
  }
};
