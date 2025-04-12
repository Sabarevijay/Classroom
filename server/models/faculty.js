// models/FacultyClass.js
import mongoose from "mongoose";

const facultyClassSchema = new mongoose.Schema(
  {
    ClassName: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "facultyclasses" }
);

const FacultyClassModel = mongoose.model("FacultyClass", facultyClassSchema);

export default FacultyClassModel;