import express from'express'
import { googleAuth, logIn, logOut, resetPassword, sendOTP, signUp, verifyOTP } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', logIn);
authRouter.get('/logout', logOut);
authRouter.post('/sendotp', sendOTP);
authRouter.post('/verifyotp', verifyOTP);
authRouter.post('/resetpassword', resetPassword);
authRouter.post('/googleauth', googleAuth);


export default authRouter;