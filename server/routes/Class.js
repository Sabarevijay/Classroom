import express from "express";
import { CreateClass, getClassById, getClasses } from "../controllers/Class.js";

const ClassRoutes=express.Router()

ClassRoutes.post('/createclass',CreateClass)
ClassRoutes.get('/getclass',getClasses)
ClassRoutes.get('/getclass/:id', getClassById);

export default ClassRoutes