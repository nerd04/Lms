import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // description: {
    //     type: 
    // }
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "educator"],
        required: true
    },
    imageUrl: {
        type: String,
        default: "",
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses"
    }],
    resetOtp: {
        type:String
    },
    otpExpires:{
        type: Date
    },
    isOtpVerified:{
        type: Boolean,
        default: false
    }

},{timestamps:true})



export const User = mongoose.model("User", userSchema);