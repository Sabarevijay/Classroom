import mongoose from "mongoose";

const StudentsSchema=new mongoose.Schema({
    Register:{
        type:String,
        required:true
    },
    ClassId:{
        type:String,required: true
    }
},{timestamps:true})

const StudentsModel = mongoose.model('Students',StudentsSchema)

export default StudentsModel