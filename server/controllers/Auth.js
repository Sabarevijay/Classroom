import UserModel from "../models/user.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const Register=async(req,res)=>{
  try {
    const {Register,email,password}=req.body
    const existUser=await UserModel.findOne({email})
    if (existUser) {
        return res.status(409).json({
            success:"false",
            message:"User Already Exist"
        })
    }
    const imagePath=req.file.filename
    const hasepassword =await bcryptjs.hashSync(password,10)
     const NewUser=await UserModel({
        Register,
        email,
        password:hasepassword,
        profile:imagePath
     })
     await NewUser.save()
     return res.status(201).json({
        success:true,
        message:"User Registered successfully",
        user:NewUser
     })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"Internal server occured"
    })
  }
}

const Login=async(req,res)=>{
    try {
        const {email,password}=req.body
        if (!email || !password) {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const FindUser=await UserModel.findOne({email})
        if (!FindUser) {
            return res.status(400).json({
                success:false,
                message:"No user Found"
            })
        }
        const comparepassword=await bcryptjs.compare(password,FindUser.password) 
        if (!comparepassword) {
            return res.status(400).json({
                success:false,
                message:"Invalid password"
            })
        }
        res.status(200).json({
            success:true,
            message:"Login successfully",
            user:FindUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server occured"
        })
    }
}

export {Register,Login}

