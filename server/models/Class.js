import mongoose from "mongoose";

const classSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
      classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
      },
      filename: {
        type: String,
        required: true,
      },
      originalFilename: { // New field to store the original filename
        type: String,
        required: true,
      },
      filePath: {
        type: String,
        required: true,
      },
      uploadDate: {
        type: Date,
        default: Date.now,
      },
},{timestamps:true})

const ClassModel=mongoose.model('Class',classSchema)

export default ClassModel