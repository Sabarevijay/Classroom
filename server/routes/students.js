import express from "express";
import { addstudents } from "../controllers/students.js";

const StudentRoutes=express.Router()

StudentRoutes.post('/addstudents',addstudents)

export default StudentRoutes