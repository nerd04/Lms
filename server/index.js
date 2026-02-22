import express from 'express'
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
dotenv.config()

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.get('/', (req, res)=>{
    res.send("Hello from server")
    
})

let isconnected = false;

app.use((req, res, next)=>{
    if(!isconnected){
        connectDB()
        isconnected = true;
    } 
    next();
})

// app.listen(process.env.FRONTEND_URL, (req, res)=>{
//     console.log("Server started listening on ",process.env.FRONTEND_URL);
// })

module.exports = app;