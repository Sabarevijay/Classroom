import mongoose from "mongoose";

const classSchema=new mongoose.Schema({
      ClassName: {
        type: String,
        required: true,
     },
      isArchived: {
        type: Boolean,
        default: false,
      },
},{timestamps:true})

const ClassModel=mongoose.model('Class',classSchema)

export default ClassModel