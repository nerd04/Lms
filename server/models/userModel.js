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
    }]

},{timestamps:true})



export const User = mongoose.model("User", userSchema);