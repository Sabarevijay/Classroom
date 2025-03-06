import express from "express";
import { CreateClass, getClasses } from "../controllers/Class.js";

const ClassRoutes=express.Router()

ClassRoutes.post('/createclass',CreateClass)
ClassRoutes.get('/getclass',getClasses)

export default ClassRoutes