// models/FacultyClass.js
import mongoose from "mongoose";

const facultyClassSchema = new mongoose.Schema(
  {
    ClassName: {
      type: String,
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String, // Store user email or ID to track who created it
      required: true,
    },
  },
  { timestamps: true, collection: "facultyclasses" } // Explicit collection name
);

const FacultyClassModel = mongoose.model("FacultyClass", facultyClassSchema);

export default FacultyClassModel;