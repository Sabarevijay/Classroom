import AttendanceModel from "../models/attendance.js";

const getAttendance=async(req,res)=>{
    try {
        
        const attendance = await AttendanceModel.find();
        if (!attendance) {
            return res.status(400).json({
                success:false,
                message:"No datas Found"
               
            })
        }
        res.status(200).json({
             success: true,
              attendance
             });
    } catch (error) {
        console.error(error);
         res.status(500).json({
             success: false, 
             message: "Internal server error" 
            });
    }
}


export {getAttendance}