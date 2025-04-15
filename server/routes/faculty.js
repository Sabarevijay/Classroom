// server/routes/FacultyClass.js
import express from "express";
import {
  CreateFacultyClass,
  getFacultyClasses,
  getAllFacultyClasses,
  getFacultyClassById,
  editFacultyClass,
  deleteFacultyClass,
  archiveFacultyClass,
  unarchiveFacultyClass,
  getArchivedFacultyClasses,
  getClassworks,
  uploadClasswork,
  deleteClasswork,
  downloadClasswork,
} from "../controllers/faculty.js";
import  upload from "../middleware/Multer.js"; // Assuming you have multer middleware



const FacultyClassRoutes = express.Router();

FacultyClassRoutes.post("/createclass", CreateFacultyClass);
FacultyClassRoutes.get("/getclass", getFacultyClasses);
FacultyClassRoutes.get("/getallclasses", getAllFacultyClasses);
FacultyClassRoutes.get("/getclass/:id", getFacultyClassById);
FacultyClassRoutes.post("/updateclass/:id", editFacultyClass);
FacultyClassRoutes.post("/deleteclass/:id", deleteFacultyClass);
FacultyClassRoutes.post("/archiveclass/:id", archiveFacultyClass);
FacultyClassRoutes.post("/unarchiveclass/:id", unarchiveFacultyClass);
FacultyClassRoutes.get("/getarchived", getArchivedFacultyClasses);
FacultyClassRoutes.get("/classwork/:id", getClassworks);
FacultyClassRoutes.post("/classwork/upload", upload.array("files"), uploadClasswork);
FacultyClassRoutes.post("/classwork/delete/:classworkId", deleteClasswork);
FacultyClassRoutes.get("/classwork/download/:classworkId", downloadClasswork);

export default FacultyClassRoutes;