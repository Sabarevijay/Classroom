import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { classGet } from '../services/Endpoint';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate=useNavigate()
  const [classes, setClasses] = useState([])
  const [isLoading,setIsLoading] = useState(true)

  const handleNewClass = (newClass) => {
    console.log("New class received:", newClass);
    setClasses(prevClasses => [newClass, ...prevClasses]);
  };
   const getClass=async()=>{
    setIsLoading(true)
   
    try {
      const response = await classGet("/class/getclass");
      const data = response.data;     
      const sortedClass = data.getclass.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (response.data.success && response.data.newClass) {
         console.log("New class received:", newClass);
        handleNewClass(response.data.newClass); // Assuming the response sends back the new class
      }
      setClasses(sortedClass);
     
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setIsLoading(false);
    }
   }
   

   useEffect(() => {
    getClass();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[800px]">
        <div className="h-10 w-10 bg-blue-500 rounded-full animate-ping"></div>
      </div>
    );
  }
 const handleClassClick=(classId)=>{
  navigate(`/admin/classadmin/${classId}`)
 }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        
        <div 
          className="min-h-screen pt-32 flex items-center justify-center"
          style={{ 
            paddingTop: "calc(1px)",
            paddingLeft: "calc(10px )", 
          }}

        >
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-25 justify-items-center">
  {classes.map((cls, index) => {
    const colors = [ "bg-green-400", "bg-red-400", "bg-yellow-500","bg-blue-400", "bg-purple-500"];
    const color = colors[index % colors.length]; 

    return (
      <div 
        key={cls._id || index}
        className={`w-80 h-40 ${color} rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-xl transform transition-transform hover:scale-105 border-1 border-black`}
        style={{cursor:"pointer"}}
        onClick={()=>handleClassClick(cls._id)}
      >
        {cls.ClassName}
      </div>
    );
  })}
</div>

         
        </div>
      </div>
    </div>
  );
};

export default Home;