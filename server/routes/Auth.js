import express from "express";
import { getUsers, Login, Logout, Register } from "../controllers/Auth.js";
import upload from "../middleware/Multer.js";


const AuthRoutes=express.Router()

AuthRoutes.post('/register',upload.single('profile'),Register)
AuthRoutes.post('/login',Login)
AuthRoutes.post('/logout',Logout)
AuthRoutes.get('/getusers',getUsers)

export default AuthRoutes