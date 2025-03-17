import express from "express";
import { CreateClass, getClassById, getClasses, getStudentsClasses } from "../controllers/Class.js";

const ClassRoutes=express.Router()

ClassRoutes.post('/createclass',CreateClass)
ClassRoutes.get('/getclass',getClasses)
ClassRoutes.get('/getclass/:id', getClassById);
ClassRoutes.get('/studentclasses/:register',getStudentsClasses)

export default ClassRoutes