import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { classGet } from '../services/Endpoint';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Home = () => {
  const navigate=useNavigate()
  const [classes, setClasses] = useState([])
  const [isLoading,setIsLoading] = useState(true)
  const user = useSelector((state) => state.auth.user);
  

  



  const handleNewClass = (newClass) => {
   
    setClasses(prevClasses => [newClass, ...prevClasses]);
  };


  
   const getClass=async()=>{
    setIsLoading(true)
    
   
    try {
      
      const userRegister = user?.Register;
      if (user.role === 'admin') {
      
        const response = await classGet("/class/getclass");
        const sortedClass = response.data.getclass.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setClasses(sortedClass);
    } else if (user.role === 'user') {
      
        
        const studentResponse = await classGet(`/class/studentclasses/${userRegister}`);
        if (studentResponse.data.success) {
            const sortedClass = studentResponse.data.classes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setClasses(sortedClass);
        } else {
            setClasses([]); 
        }
    }
     
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
  const handleClassClick = (classId) => {
    if (!user) {
      console.error("User not found!");
      navigate('/');
      return;
    }
  
    if (user.role === 'admin') {
      navigate(`/admin/classadmin/${classId}`);
    } else if (user.role === 'user') {
      navigate(`/home/classstudents/${classId}`);
    } else {
      console.error("Unknown role:", user.role);
      navigate('/');
    }
  };

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
  {classes.length === 0 && !isLoading && (
  <p className="text-gray-500 text-2xl " style={{alignItems:"center",textAlign:"center",marginLeft:"350px"}}>No classes assigned to you.</p>
)}
</div>

         
        </div>
      </div>
    </div>
  );
};

export default Home;