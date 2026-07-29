import express from 'express'
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';
dotenv.config()

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

let isConnected = false;

app.use(async (req, res, next)=>{
    if(!isConnected){
        await connectDB();
        isConnected = true;
    }
    next();
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/courses", courseRouter)

app.get('/', (req, res)=>{
    res.send("Hello from WeLearn server")
})

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started listening on port ${port}`);
    });
}

export default app;

// module.exports = app;