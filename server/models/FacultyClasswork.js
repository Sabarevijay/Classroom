// server/models/Classwork.js
import mongoose from "mongoose";

const classworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    classType: {
      type: String,
      enum: ['class', 'faculty'],
      required: true,
    },
  },
  { timestamps: true, collection: "classworks" }
);

const FacultyClassworkModel = mongoose.model("FacultyClasswork", classworkSchema);

export default FacultyClassworkModel;