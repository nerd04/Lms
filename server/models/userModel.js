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
    },
    role: {
        type: String,
        enum: ["student", "educator"],
        required: true
    },
    imageUrl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
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