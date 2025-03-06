import mongoose from "mongoose";

const classSchema=new mongoose.Schema({
    ClassName:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
    },
    otpExpiresAt:{
        type:String,
    }
})

const ClassModel=mongoose.model('Class',classSchema)

export default ClassModel