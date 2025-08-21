import bcrypt from 'bcryptjs'
import validator from 'validator'
import { User } from "../models/userModel.js"
import generateToken from '../config/generateToken.js'

export const signUp = async(req, res)=>{
    try{
        console.log(req.body)
        const {name, email, password, role} = req.body
        let existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message: "user with this email already exists"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message: "email is not in invalid format"})
        }
        if(password.length < 8){
            return res.status(400).json({message: "password length should be atleast 8 characters"})
        }

        let hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role,
        })
        if(!user){
            return res.status(400).json({message: "error in creating user"});
        }

        const token = await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly:true,
            secure: true,
            sameSize: "Strict",
            maxAge: 7*24*60*60*1000
        })

        return res.status(201).json(user)
    } catch(error){
        return res.status(500).json({message: `SignUp error ${error}`});
    }
}

export const logIn = async(req, res)=>{
    try {
        const {email, password} = req.body
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "user not found"})
        }
        let isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "password doesn't match"})
        }

        let token = await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly:true,
            secure: true,
            sameSize: "Strict",
            maxAge: 7*24*60*60*1000
        })

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message: `logIn error ${error}`});
    }
}

export const logOut = async (req, res)=>{
    try {
        await res.clearCookie("token");
        return res.status(200).json({message: "logged out succesfully"})
    } catch (error) {
        return res.status(500).json({message: `logOut error ${error}`});
    }
}