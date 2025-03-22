import React, { useEffect, useState } from 'react'
import { addstudentsPost, classGet } from '../services/Endpoint'
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const Addstudents = () => {
  const { id } = useParams(); 
  console.log("Class ID from params:", id);
  const [registerNumber, setRegisterNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  // const [classData, setClassData] = useState('')
  

  const handleSubmit=async(e)=>{
    e.preventDefault()
   try {
    setIsLoading(true)
    const response = await addstudentsPost('/students/addstudents', { Register:registerNumber, classId: id  });
    // console.log('Students added:', response.data);
    setRegisterNumber("")
    closeModal()
    toast.success("Student Added successfully ")
   } catch (error) {
    // console.log(error)
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
            Submit
            {/* {isLoading ? "Submitting..." : "Submit"} */}
          </button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default Addstudents
