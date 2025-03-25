import express from "express";
import { archiveClass, CreateClass, deleteClass, editClass, getArchivedClasses, getClassById, getClasses, getStudentsClasses, unarchiveClass } from "../controllers/Class.js";

const ClassRoutes=express.Router()

ClassRoutes.post('/createclass',CreateClass)
ClassRoutes.get('/getclass',getClasses)
ClassRoutes.get('/getclass/:id', getClassById);
ClassRoutes.get('/studentclasses/:register',getStudentsClasses)
ClassRoutes.post('/archiveclass/:id', archiveClass);
ClassRoutes.post('/updateclass/:id', editClass);
ClassRoutes.post('/deleteclass/:id', deleteClass);
ClassRoutes.post('/unarchiveclass/:id', unarchiveClass);
ClassRoutes.get('/getarchived', getArchivedClasses);

export default ClassRoutes