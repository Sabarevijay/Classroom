import React, { useEffect, useState } from 'react'
import { addstudentsPost,  deleteRequest,  get } from '../services/Endpoint'
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

const Addstudents = () => {
  const { id } = useParams(); 
  // console.log("Class ID from params:", id);
  const [students, setStudents] = useState([]);
  const [registerNumber, setRegisterNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  // const [classData, setClassData] = useState('')





  const getStudents=async()=>{
    try {
      setIsLoading(true);
      const response= await get(`/students/getstudents`,{ classId: id })
      // const sortedClass = response.data.getclass.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setStudents(response.data.students || []);
    } catch (error) {
      console.log("Error fetching students",error)
      toast.error("Failed to fetch students");
    } finally{
      setIsLoading(false)
    }
    
  }
  useEffect(() => {
    getStudents(); 
  }, []);

  const handleDelete = async (register) => {
    try {
        setIsLoading(true);
        const response = await deleteRequest(`/students/deletestudents`, {
            Register: register,
            classId: id,  
        });

        toast.success(response.data.message);
        getStudents();  
    } catch (error) {
        console.error("Error deleting student", error);
        toast.error(error.response?.data?.message || "Failed to delete student");
    } finally {
        setIsLoading(false);
    }
};

  

  const handleSubmit=async(e)=>{
    e.preventDefault()
   try {
    setIsLoading(true)
    const response = await addstudentsPost('/students/addstudents', { Register:registerNumber, classId: id  });
    // console.log('Students added:', response.data);
    setRegisterNumber("")
    // closeModal()
    toast.success("Student Added successfully ")
    getStudents();
   } catch (error) {
    console.log(error)
    if (error.response.status === 409) {
      toast.error(error.response.data.message); 
      
    } else {
      toast.error("An unexpected error occurred");
    }
   }
   finally{
    setIsLoading(false)
  }


  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

 


  }
  return (
    <div className="relative min-h-screen flex justify-center items-start" style={{paddingTop:'200px'}}>
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg border border-gray-300">
      <h2 className="text-xl font-semibold mb-6 text-center">
        Enter the Student's Register Number:
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Register number"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-700"
          value={registerNumber}
          onChange={(e) => setRegisterNumber(e.target.value)}
          required
        />

        <div className="text-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {/* Submit */}
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-300">
        <h2 className="text-xl font-semibold text-center mb-6">
          Registered Students
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="mt-2">No students found. Add your first student above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">S.no</th>
                  <th className="border p-2 text-left">Register Number</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((register, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2 font-medium">{register}</td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleDelete(register)}
                        className="text-red-500 hover:text-red-700" style={{cursor:'pointer'}}
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  </div>
  )
}

export default Addstudents
