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
    // const imagePath=req.file.filename
    const hasepassword =await bcryptjs.hashSync(password,10)
     const NewUser=await UserModel({
        Register,
        email,
        password:hasepassword,
        // profile:imagePath
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

        const token = jwt.sign(
            {id: FindUser._id, Register: FindUser.Register },
            process.env.JWT_SECRET,
        )
        res.status(200).json({
            success:true,
            message:"Login successfully",
            user:FindUser,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server occured"
        })
    }
}
const Logout=async(req,res)=>{
    try {
        res.clearCookie('token')
        res.status(200).json({success:true,message:"Logout successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }

}

const getUsers=async(req,res)=>{
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(400).json({
              success: false,
              message: "Invalid token or user not authenticated"
            });
          }
        const getUser=await UserModel.findById(userId, 'Register');
        if (!getUser) {
            return res.status(400).json({
                success:false,
                message:"No User Found"
               
            })
        }
        return res.status(200).json({
            success:true,
            message:"User displayed successfully",
            user:getUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:true,
            message:"Internal server occured"
        })
    }
}

export {Register,Login,Logout,getUsers}

