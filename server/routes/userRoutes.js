import express from 'express'
import {authUser} from '../middlewares/checkAuth.js'
import {getCurrentUser} from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get("/getcurrentuser", authUser, getCurrentUser)

export default userRouter