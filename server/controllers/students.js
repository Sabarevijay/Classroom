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

const getStudents =async(req,res)=>{
try {
    const classId = req.query.classId || req.params.classId;
    if (!classId) {
        return res.status(400).json({
          success: false,
          message: "classId is required",
        });
      }
    const studentsData = await StudentsModel.find({ ClassId: classId }).select("Register -_id");
    if (studentsData.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No students found for this class",
        });
      }
    return res.status(200).json({
        success:true,
        message:"Students data retrieved",
        students: studentsData.map(student => student.Register),
    })
} catch (error) {
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"Internal error occured"
    })
}
}

const delteteStudents=async(req,res)=>{
    try {
        const {Register, classId}=req.body
        if (!Register || !classId) {
            return res.status(400).json({
                success: false,
                message: "Register number and classId are required",
            });
        }
        const removestudents=await StudentsModel.findOneAndDelete({ Register, ClassId: classId })
        if (!removestudents) {
            return res.status(404).json({
                success:false,
                message:"Particular student not found"
            })
       }
       return res.status(200).json({
        success:true,
        message:"Deleted successfully"
       })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server occured"
        })
    }

}

export {addstudents,getStudents,delteteStudents}