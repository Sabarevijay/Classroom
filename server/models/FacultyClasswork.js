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
    data: {
      type: Buffer, // Store the file content as a Buffer
      required: true,
    },
    contentType: {
      type: String, // Store the MIME type of the file (e.g., "application/pdf")
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