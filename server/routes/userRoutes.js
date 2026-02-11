import express from 'express'
import {authUser} from '../middlewares/checkAuth.js'
import {getCurrentUser, updateProfile} from '../controllers/userController.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.get("/getcurrentuser", authUser, getCurrentUser)
userRouter.post("/updateprofile", authUser, upload.single("imageUrl"), updateProfile)

export default userRouter