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
    fileSize: {
      type: Number, // Store file size in bytes
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
    createdBy: {
      type: String,
      required: true, 
    },
  },
  { timestamps: true, collection: "classworks" }
);

const FacultyClassworkModel = mongoose.model("FacultyClasswork", classworkSchema);

export default FacultyClassworkModel;