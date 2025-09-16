import express from'express'
import { logIn, logOut, resetPassword, sendOTP, signUp, verifyOTP } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', logIn);
authRouter.get('/logout', logOut);
authRouter.post('/sendotp', sendOTP);
authRouter.post('/verifyotp', verifyOTP);
authRouter.post('/resetpassword', resetPassword);



export default authRouter;