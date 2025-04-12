// controllers/FacultyClass.js
import FacultyClassModel from "../models/faculty.js";
import ClassworkModel from "../models/Classwork.js";
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
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const classes = await FacultyClassModel.find({ createdBy: userEmail }).sort({ createdAt: -1 });
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
    const classes = await FacultyClassModel.find().sort({ createdAt: -1 });
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

    const archivedClasses = await FacultyClassModel.find({ createdBy: userEmail, isArchived: true });
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
};