import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
  try {
    const {token} = req.cookies;
    console.log("Token from cookie:", token);

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
        return res.status(400).json({message: "user doesn't  have valid token"})
    }
    console.log("Decoded token:", decoded);
    req.userId = decoded.userId;
    res.send(200).json({ message: "access granted " });
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
