import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  ClassName: {
    type: String,
    required: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: String, // Store the email of the admin who created the class
    required: true,
  },
}, { timestamps: true });

const ClassModel = mongoose.model('Class', classSchema);
export default ClassModel;