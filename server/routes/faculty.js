// routes/FacultyClass.js
import express from "express";
import {
  CreateFacultyClass,
  getFacultyClasses,
  getFacultyClassById,
  editFacultyClass,
  deleteFacultyClass,
  archiveFacultyClass,
  unarchiveFacultyClass,
  getArchivedFacultyClasses,
} from "../controllers/faculty.js";

const FacultyClassRoutes = express.Router();

FacultyClassRoutes.post("/createclass", CreateFacultyClass);
FacultyClassRoutes.get("/getclass", getFacultyClasses);
FacultyClassRoutes.get("/getclass/:id", getFacultyClassById);
FacultyClassRoutes.post("/updateclass/:id", editFacultyClass);
FacultyClassRoutes.post("/deleteclass/:id", deleteFacultyClass);
FacultyClassRoutes.post("/archiveclass/:id", archiveFacultyClass);
FacultyClassRoutes.post("/unarchiveclass/:id", unarchiveFacultyClass);
FacultyClassRoutes.get("/getarchived", getArchivedFacultyClasses);

export default FacultyClassRoutes;