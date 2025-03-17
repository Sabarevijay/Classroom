import ClassModel from "../models/Class.js";
import StudentsModel from "../models/students.js";

const CreateClass=async(req,res)=>{
    try {
        const {ClassName}=req.body
        if(!ClassName){
            return res.status(400).json({
                success:false,
                message:"Class name is required"
            })
        }

        const NewClass= await ClassModel.create({ClassName})
        return res.status(201).json({
            message: 'Class created successfully',
            class: NewClass
          });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success:false,
            message: 'Internal server error'
         });
    }
}

const getClasses=async(req,res)=>{
    try {
        const getclass=await ClassModel.find()
        if (!getclass) {
            return res.status(400).json({
                success:false,
                message:"No post Found"
               
            })
        }
        return res.status(200).json({
            success:true,
            message:"Class displayed successfully",
            getclass
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:true,
            message:"Internal server occured"
        })
    }
}
const getClassById = async (req, res) => {
    try {
        const { id } = req.params;
        const classData = await ClassModel.findById(id);
        if (!classData) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Class data retrieved successfully",
            classData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


const getStudentsClasses =async(req,res)=>{
    try {
        
        const {register}=req.params
        const studentRecords=await StudentsModel.find({Register:register})
      
        if (!studentRecords.length) {
            return res.status(404).json({
                success: false,
                message: "No classes found for this student"
            });
        }
        const classIds = studentRecords.map(student => student.ClassId);
         
        if (!classIds.length) {
            return res.status(404).json({
                success: false,
                message: "No class IDs found for this student"
            });
        }

        const studentClasses = await ClassModel.find({_id:{ $in: classIds } })
        return res.status(200).json({
            success: true,
            message: "Student's classes retrieved successfully",
            classes: studentClasses
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export {CreateClass,getClasses,getClassById,getStudentsClasses}