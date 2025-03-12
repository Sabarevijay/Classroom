import mongoose from "mongoose";

const attendanceSchema=new mongoose.Schema({
    user:{
        type:String,
      
    },
    status:{
      type:String,
      enum:['present','absent'],
      // default:'absent',
      required:true  
    }
})

const AttendanceModel=mongoose.model("Attendance",attendanceSchema)
export default AttendanceModel