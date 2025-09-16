import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../App';

function ForgetPassword() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const otp = useRef();
    const password1 = useRef();
    const password2 = useRef();

    //Step 1: send OTP to email
    const handleStepOne = async () => {
        const eformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!eformat.test(email)) {
            return toast.error("Invalid email address")
        }
        try {
            const res = await axios.post(`${serverUrl}/api/auth/sendotp`, { email: email }, { withCredentials: true })
            setStep(2);
            toast.success(res.data.message);
        } catch (error) {
            console.error(error.response.data.message)
            toast.error(error.response.data.message)
        }
    }


    //Step 2: Verify OTP 
    const handleStepTwo = async() => {
        const otpVal = otp.current.value;
        try {
            const res = await axios.post(`${serverUrl}/api/auth/verifyotp`, { email: email, otp:otpVal }, { withCredentials: true })
            toast.success(res.data.message)
            setStep(3);
        } catch (error) {
            toast.error("Error in verifying OTP")
        }

    }

    //Step 3: Reset with new Password
    const handleStepThree = async () => { 
        const password1Val = password1.current.value;
        const password2Val = password2.current.value;
        if(password1Val === password2Val){
            try {
                const res = await axios.post(`${serverUrl}/api/auth/resetpassword`, {email: email, password: password1Val}, {withCredentials:true});
                toast.success(res.data.message);
                navigate('/login')

            } catch (error) {
                toast.error(error.response.data.message)
            }
        }else{
            toast.error("password doesn't match");
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100 px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                {/* Step 1: Email Input */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-purple-700">Forgot Your Password?</h4>
                        <p className="text-sm text-gray-600">Enter your account's email address</p>
                        <input
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none rounded px-3 py-2"
                            type="email"
                            name="email"
                            id="email"
                            // ref={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                        <button
                            onClick={handleStepOne}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition"
                        >
                            Send OTP
                        </button>
                        <span className="text-sm text-purple-500 hover:underline cursor-pointer" onClick={() => navigate("/login")}>
                            Back to Login
                        </span>
                    </div>
                )}

                {/* Step 2: OTP Input */}
                {step === 2 && (
                    <div className="space-y-5">
                        <div className="text-center">
                            <h4 className="text-2xl font-bold text-purple-700">Verify OTP</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Enter the 4-digit code sent to your email
                            </p>
                        </div>

                        <input
                            className="w-full text-center tracking-widest text-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none rounded px-4 py-2"
                            type="text"
                            name="otp"
                            id="otp"
                            ref={otp}
                            placeholder="••••"
                            maxLength={4}
                        />

                        <button
                            onClick={handleStepTwo}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition"
                        >
                            Verify OTP
                        </button>

                        <div className="flex justify-between items-center text-sm text-purple-500">
                            <button
                                onClick={() => setStep(1)}
                                className="hover:underline flex items-center space-x-1"
                            >
                                <span>&larr;</span>
                                <span>Back</span>
                            </button>

                            <button
                                onClick={() => navigate('/login')}
                                className="hover:underline"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                )}


                {/* Step 3: Reset Password */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-purple-700">Reset Password</h4>
                        <label className="block text-sm text-gray-600" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none rounded px-3 py-2"
                            type="password"
                            id="newPassword"
                            ref={password1}
                            placeholder="Enter new password"
                        />
                        <label className="block text-sm text-gray-600" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none rounded px-3 py-2"
                            type="password"
                            id="confirmPassword"
                            ref={password2}
                            placeholder="Confirm new password"
                        />
                        <button
                            onClick={handleStepThree}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition"
                        >
                            Reset Password
                        </button>
                        <span
                            onClick={() => navigate('/login')}
                            className="text-sm text-purple-500 hover:underline cursor-pointer"
                        >
                            Back to Login
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgetPassword;
