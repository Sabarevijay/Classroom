import StudentsModel from "../models/students.js"

const addstudents=async(req,res)=>{
    try {
        const {Register,classId }=req.body
        console.log("Request body:", req.body);
         if (!Register || !classId) {
            return res.status(400).json({
                success: false,
                message: "Register number and classId are required",
            });
        }
        const existStudent=await StudentsModel.findOne({Register,ClassId: classId })
        if(existStudent){
            return res.status(409).json({
                success:"false",
                message:"Stduent Already Exist"
            })
        }
        const NewStudents = new StudentsModel({Register,ClassId: classId })
        await NewStudents.save()
        return res.status(201).json({
            success:true,
            message:"Stduents added successfully",
            user:NewStudents
         })

    } catch (error) {
        return res.status(500).json({
        success:false,
        message:"Internal server occured"
    })
    }
}
export {addstudents}