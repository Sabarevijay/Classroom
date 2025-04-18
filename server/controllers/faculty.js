// controllers/FacultyClass.js
import FacultyClassModel from "../models/faculty.js";
import FacultyClassworkModel from "../models/FacultyClasswork.js";
import path from "path";
import fs from "fs";

const CreateFacultyClass = async (req, res) => {
  try {
    const { ClassName, semester, year } = req.body;
    const userEmail = req.body.createdBy;
    if (!ClassName || !semester || !year || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "Class name, semester, year, and creator email are required",
      });
    }

    const validSemesters = ['Odd', 'Even'];
    const validYears = ['2019-20', '2020-21', '2021-22', '2022-23', '2024-25', '2025-26', '2026-27'];
    if (!validSemesters.includes(semester)) {
      return res.status(400).json({
        success: false,
        message: "Semester must be 'Odd' or 'Even'",
      });
    }
    if (!validYears.includes(year)) {
      return res.status(400).json({
        success: false,
        message: "Year must be one of: " + validYears.join(', '),
      });
    }

    const NewClass = await FacultyClassModel.create({ ClassName, semester, year, createdBy: userEmail });
    return res.status(201).json({
      success: true,
      message: "Faculty class created successfully",
      class: NewClass,
    });
  } catch (error) {
    console.error("CreateFacultyClass error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getFacultyClasses = async (req, res) => {
  try {
    const userEmail = req.query.email;
    const userRole = req.user?.role; // Assuming req.user is populated by authMiddleware
    if (!userEmail || !userRole) {
      return res.status(400).json({
        success: false,
        message: "User email and role are required",
      });
    }

    let classes;
    if (userRole === 'admin') {
      // Admins can see all faculty classes
      classes = await FacultyClassModel.find({ isArchived: false }).sort({ createdAt: -1 });
    } else if (userRole === 'faculty') {
      // Faculty members can only see their own classes
      classes = await FacultyClassModel.find({ createdBy: userEmail, isArchived: false }).sort({ createdAt: -1 });
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only admins and faculty members can access this endpoint",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty classes retrieved successfully",
      getclass: classes,
    });
  } catch (error) {
    console.error("getFacultyClasses error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllFacultyClasses = async (req, res) => {
  try {
    const classes = await FacultyClassModel.find({ isArchived: false }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "All faculty classes retrieved successfully",
      getclass: classes,
    });
  } catch (error) {
    console.error("getAllFacultyClasses error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getFacultyClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await FacultyClassModel.findById(id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Faculty class data retrieved successfully",
      classData,
    });
  } catch (error) {
    console.error("getFacultyClassById error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const editFacultyClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { ClassName, semester, year } = req.body;

    if (!ClassName || !semester || !year) {
      return res.status(400).json({
        success: false,
        message: "Class name, semester, and year are required",
      });
    }

    const validSemesters = ['Odd', 'Even'];
    const validYears = ['2019-20', '2020-21', '2021-22', '2022-23', '2024-25', '2025-26', '2026-27'];
    if (!validSemesters.includes(semester)) {
      return res.status(400).json({
        success: false,
        message: "Semester must be 'Odd' or 'Even'",
      });
    }
    if (!validYears.includes(year)) {
      return res.status(400).json({
        success: false,
        message: "Year must be one of: " + validYears.join(', '),
      });
    }

    const updatedClass = await FacultyClassModel.findByIdAndUpdate(
      id,
      { ClassName, semester, year },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty class updated successfully",
      class: updatedClass,
    });
  } catch (error) {
    console.error("editFacultyClass error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteFacultyClass = async (req, res) => {
  try {
    const { id } = req.params;

    const classToDelete = await FacultyClassModel.findByIdAndDelete(id);
    if (!classToDelete) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }

    // Optionally delete associated classworks
    await ClassworkModel.deleteMany({ classId: id, classType: 'faculty' });

    return res.status(200).json({
      success: true,
      message: "Faculty class deleted successfully",
    });
  } catch (error) {
    console.error("deleteFacultyClass error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const archiveFacultyClass = async (req, res) => {
  try {
    const { id } = req.params;

    const classToArchive = await FacultyClassModel.findById(id);
    if (!classToArchive) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }

    classToArchive.isArchived = true;
    await classToArchive.save();

    return res.status(200).json({
      success: true,
      message: "Faculty class archived successfully",
    });
  } catch (error) {
    console.error("archiveFacultyClass error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const unarchiveFacultyClass = async (req, res) => {
  try {
    const { id } = req.params;

    const classToUnarchive = await FacultyClassModel.findById(id);
    if (!classToUnarchive) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }

    classToUnarchive.isArchived = false;
    await classToUnarchive.save();

    return res.status(200).json({
      success: true,
      message: "Faculty class unarchived successfully",
    });
  } catch (error) {
    console.error("unarchiveFacultyClass error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getArchivedFacultyClasses = async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const archivedClasses = await FacultyClassModel.find({ createdBy: userEmail, isArchived: true }).sort({ createdAt: -1 });
    if (!archivedClasses || archivedClasses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No archived faculty classes found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Archived faculty classes retrieved successfully",
      archivedClasses,
    });
  } catch (error) {
    console.error("getArchivedFacultyClasses error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getClassworks = async (req, res) => {
  try {
    const { id } = req.params;
    const classExists = await FacultyClassModel.findById(id);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }

    const classworks = await FacultyClassworkModel.find({ classId: id, classType: 'faculty' }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Classworks retrieved successfully",
      classworks,
    });
  } catch (error) {
    console.error("getClassworks error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const uploadClasswork = async (req, res) => {
  try {
    const { classId, title } = req.body;
    if (!classId || !title || !req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Class ID, title, and at least one file are required",
      });
    }

    const classExists = await FacultyClassModel.findById(classId);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }

    // Get the creator's email from req.user (populated by authMiddleware)
    const createdBy = req.user?.email;
    if (!createdBy) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User email not found",
      });
    }

    const classworks = [];
    for (const file of req.files) {
      const classwork = await FacultyClassworkModel.create({
        title,
        filename: file.filename,
        originalFilename: file.originalname,
        path: file.path,
        classId,
        classType: 'faculty',
        createdBy,
      });
      classworks.push(classwork);
    }

    return res.status(201).json({
      success: true,
      message: "Classworks uploaded successfully",
      classworks,
    });
  } catch (error) {
    console.error("uploadClasswork error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteClasswork = async (req, res) => {
  try {
    const { classworkId } = req.params;
    const classwork = await FacultyClassworkModel.findById(classworkId);
    if (!classwork || classwork.classType !== 'faculty') {
      return res.status(404).json({
        success: false,
        message: "Classwork not found",
      });
    }

    // Fetch the class to check the creator
    const classData = await FacultyClassModel.findById(classwork.classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Check if the current user is the creator of the class
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User email not found",
      });
    }

    if (classData.createdBy !== userEmail) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete classworks in classes you created",
      });
    }

    // Delete file from storage
    if (fs.existsSync(classwork.path)) {
      fs.unlinkSync(classwork.path);
    }

    await FacultyClassworkModel.findByIdAndDelete(classworkId);
    return res.status(200).json({
      success: true,
      message: "Classwork deleted successfully",
    });
  } catch (error) {
    console.error("deleteClasswork error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const downloadClasswork = async (req, res) => {
  try {
    const { classworkId } = req.params;
    const classwork = await FacultyClassworkModel.findById(classworkId);
    if (!classwork || classwork.classType !== 'faculty') {
      return res.status(404).json({
        success: false,
        message: "Classwork not found",
      });
    }

    const filePath = path.resolve(classwork.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    res.download(filePath, classwork.originalFilename);
  } catch (error) {
    console.error("downloadClasswork error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
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
};