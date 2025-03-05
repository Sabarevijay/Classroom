import express from "express";
import { Login, Register } from "../controllers/Auth.js";
import upload from "../middleware/Multer.js";

const AuthRoutes=express.Router()

AuthRoutes.post('/register',upload.single('profile'),Register)
AuthRoutes.post('/login',Login)

export default AuthRoutes